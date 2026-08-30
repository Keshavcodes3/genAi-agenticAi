import chatModel from "../Models/chat.model.js";
import ConversationModel from "../Models/conversation.model.js";
import projectModel from "../Models/Project.model.js";
import User from "../Models/user.model.js";

const startOfToday = (date = new Date()) => {
    const today = new Date(date);
    today.setHours(0, 0, 0, 0);
    return today;
};

const startOfWeek = (date) => {
    const value = new Date(date);
    value.setHours(0, 0, 0, 0);
    const day = value.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    value.setDate(value.getDate() + diff);
    return value;
};

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const formatDateKey = (date) => date.toISOString().slice(0, 10);

const formatMonthKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const buildDailyUserBuckets = (users, days = 7) => {
    const today = startOfToday();
    const buckets = [];

    for (let index = days - 1; index >= 0; index -= 1) {
        const date = new Date(today);
        date.setDate(today.getDate() - index);
        buckets.push({
            key: formatDateKey(date),
            label: date.toLocaleDateString("en-US", { weekday: "short" }),
            users: 0,
        });
    }

    const bucketByKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));

    users.forEach((user) => {
        if (!user.createdAt) return;

        const key = formatDateKey(startOfToday(user.createdAt));
        const bucket = bucketByKey.get(key);
        if (bucket) bucket.users += 1;
    });

    return buckets;
};

const buildWeeklyUserBuckets = (users, weeks = 8) => {
    const thisWeek = startOfWeek(new Date());
    const buckets = [];

    for (let index = weeks - 1; index >= 0; index -= 1) {
        const date = new Date(thisWeek);
        date.setDate(thisWeek.getDate() - index * 7);
        buckets.push({
            key: formatDateKey(date),
            label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            users: 0,
        });
    }

    const bucketByKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));

    users.forEach((user) => {
        if (!user.createdAt) return;

        const key = formatDateKey(startOfWeek(user.createdAt));
        const bucket = bucketByKey.get(key);
        if (bucket) bucket.users += 1;
    });

    return buckets;
};

const buildMonthlyUserBuckets = (users, months = 6) => {
    const thisMonth = startOfMonth(new Date());
    const buckets = [];

    for (let index = months - 1; index >= 0; index -= 1) {
        const date = new Date(thisMonth);
        date.setMonth(thisMonth.getMonth() - index);
        buckets.push({
            key: formatMonthKey(date),
            label: date.toLocaleDateString("en-US", { month: "short" }),
            users: 0,
        });
    }

    const bucketByKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));

    users.forEach((user) => {
        if (!user.createdAt) return;

        const key = formatMonthKey(startOfMonth(user.createdAt));
        const bucket = bucketByKey.get(key);
        if (bucket) bucket.users += 1;
    });

    return buckets;
};

const safeUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    createdAt: user.createdAt,
});

export const getPlatformAnalytics = async (_req, res) => {
    try {
        const today = startOfToday();

        const [
            totalUsers,
            totalAdmins,
            totalConversations,
            totalMessages,
            totalProjects,
            newUsersToday,
            conversationsToday,
            messagesToday,
            userMessages,
            aiMessages,
            conversationsByMode,
            registrationUsers,
            recentUsers,
            recentConversations,
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: "admin" }),
            ConversationModel.countDocuments(),
            chatModel.countDocuments(),
            projectModel.countDocuments(),
            User.countDocuments({ createdAt: { $gte: today } }),
            ConversationModel.countDocuments({ createdAt: { $gte: today } }),
            chatModel.countDocuments({ createdAt: { $gte: today } }),
            chatModel.countDocuments({ role: "user" }),
            chatModel.countDocuments({ role: "ai" }),
            ConversationModel.aggregate([
                { $group: { _id: "$mode", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            User.find()
                .sort({ createdAt: -1 })
                .select("createdAt")
                .lean(),
            User.find()
                .sort({ createdAt: -1 })
                .limit(8)
                .select("name email avatar role createdAt")
                .lean(),
            ConversationModel.find()
                .sort({ updatedAt: -1 })
                .limit(8)
                .select("title mode user createdAt updatedAt")
                .populate("user", "name email avatar")
                .lean(),
        ]);

        return res.status(200).json({
            message: "Platform analytics fetched successfully",
            success: true,
            data: {
                totals: {
                    users: totalUsers,
                    admins: totalAdmins,
                    conversations: totalConversations,
                    messages: totalMessages,
                    projects: totalProjects,
                    userMessages,
                    aiMessages,
                },
                today: {
                    users: newUsersToday,
                    conversations: conversationsToday,
                    messages: messagesToday,
                },
                conversationsByMode: conversationsByMode.map((item) => ({
                    mode: item._id || "casual",
                    count: item.count,
                })),
                registrations: {
                    daily: buildDailyUserBuckets(registrationUsers),
                    weekly: buildWeeklyUserBuckets(registrationUsers),
                    monthly: buildMonthlyUserBuckets(registrationUsers),
                },
                recentUsers: recentUsers.map(safeUser),
                recentConversations: recentConversations.map((conversation) => ({
                    _id: conversation._id,
                    title: conversation.title,
                    mode: conversation.mode,
                    createdAt: conversation.createdAt,
                    updatedAt: conversation.updatedAt,
                    user: conversation.user
                        ? {
                            name: conversation.user.name,
                            email: conversation.user.email,
                            avatar: conversation.user.avatar,
                        }
                        : null,
                })),
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error?.message,
        });
    }
};
