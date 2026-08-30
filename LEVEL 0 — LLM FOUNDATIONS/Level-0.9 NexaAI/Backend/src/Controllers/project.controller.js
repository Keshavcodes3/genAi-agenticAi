import mongoose from "mongoose";
import ConversationModel from "../Models/conversation.model.js";
import chatModel from "../Models/chat.model.js";
import projectModel from "../Models/Project.model.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const sendServerError = (res, err) => {
    return res.status(500).json({
        message: "Internal Server Error",
        success: false,
        error: process.env.MODE === "dev" ? err.message : "Something went wrong",
    });
};

const getProjectWithConversations = async ({ projectId, userId }) => {
    const project = await projectModel.findOne({ _id: projectId, userId }).lean();
    if (!project) return null;

    const conversations = await ConversationModel.find({
        user: userId,
        projectId,
    })
        .sort({ updatedAt: -1, createdAt: -1 })
        .select("title mode projectId createdAt updatedAt")
        .lean();

    const conversationIds = conversations.map((conversation) => conversation._id);
    const chatCounts = await chatModel.aggregate([
        { $match: { conversationId: { $in: conversationIds } } },
        { $group: { _id: "$conversationId", count: { $sum: 1 } } },
    ]);

    const countByConversationId = new Map(
        chatCounts.map((item) => [item._id.toString(), item.count])
    );

    return {
        ...project,
        conversations: conversations.map((conversation) => ({
            ...conversation,
            chatCount: countByConversationId.get(conversation._id.toString()) || 0,
        })),
        conversationCount: conversations.length,
    };
};

const getProjectsWithConversations = async (userId) => {
    const projects = await projectModel
        .find({ userId })
        .sort({ updatedAt: -1, createdAt: -1 })
        .lean();

    return Promise.all(
        projects.map((project) =>
            getProjectWithConversations({
                projectId: project._id,
                userId,
            })
        )
    );
};

export const createProject = async (req, res) => {
    try {
        const userId = req.user.id;
        const title = String(req.body.projectName || req.body.title || "").trim();

        if (!title) {
            return res.status(400).json({
                message: "Project name must be valid",
                success: false,
            });
        }

        const existingProject = await projectModel.findOne({ userId, title });
        if (existingProject) {
            return res.status(409).json({
                message: "Project already exists with this name",
                success: false,
            });
        }

        const project = await projectModel.create({
            title,
            userId,
        });

        return res.status(201).json({
            message: "Project created successfully",
            success: true,
            data: {
                ...project.toObject(),
                conversations: [],
                conversationCount: 0,
            },
        });
    } catch (err) {
        if (err?.code === 11000) {
            return res.status(409).json({
                message: "Project already exists with this name",
                success: false,
            });
        }

        return sendServerError(res, err);
    }
};

export const addConversationToProject = async (req, res) => {
    try {
        const userId = req.user.id;
        const { projectId } = req.params;
        const { conversationId } = req.body;

        if (!isValidObjectId(projectId) || !isValidObjectId(conversationId)) {
            return res.status(400).json({
                message: "Please provide a valid project and conversation",
                success: false,
            });
        }

        const project = await projectModel.findOne({ _id: projectId, userId });
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
                success: false,
            });
        }

        const conversation = await ConversationModel.findOneAndUpdate(
            { _id: conversationId, user: userId },
            { projectId },
            { new: true }
        )
            .select("title mode projectId createdAt updatedAt")
            .lean();

        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found",
                success: false,
            });
        }

        const chatCount = await chatModel.countDocuments({ conversationId });
        const updatedProject = await getProjectWithConversations({ projectId, userId });

        return res.status(200).json({
            message: "Successfully added to project",
            success: true,
            data: {
                project: updatedProject,
                conversation: {
                    ...conversation,
                    chatCount,
                },
            },
        });
    } catch (err) {
        return sendServerError(res, err);
    }
};

export const viewAllProjects = async (req, res) => {
    try {
        const userId = req.user.id;
        const allProjects = await getProjectsWithConversations(userId);

        return res.status(200).json({
            message: "All projects fetched successfully",
            success: true,
            data: allProjects,
        });
    } catch (err) {
        return sendServerError(res, err);
    }
};

export const deleteProject = async (req, res) => {
    try {
        const userId = req.user.id;
        const { projectId } = req.params;

        if (!isValidObjectId(projectId)) {
            return res.status(400).json({
                message: "No valid project id provided",
                success: false,
            });
        }

        const project = await projectModel.findOneAndDelete({ _id: projectId, userId });
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
                success: false,
            });
        }

        await ConversationModel.updateMany(
            { user: userId, projectId },
            { $unset: { projectId: "" } }
        );

        return res.status(200).json({
            message: "Project deleted successfully",
            success: true,
        });
    } catch (err) {
        return sendServerError(res, err);
    }
};

export const viewOneProject = async (req, res) => {
    try {
        const userId = req.user.id;
        const { projectId } = req.params;

        if (!isValidObjectId(projectId)) {
            return res.status(400).json({
                message: "No valid project id provided",
                success: false,
            });
        }

        const project = await getProjectWithConversations({ projectId, userId });
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Project fetched successfully",
            success: true,
            data: project,
        });
    } catch (err) {
        return sendServerError(res, err);
    }
};

export const renameProject = async (req, res) => {
    try {
        const userId = req.user.id;
        const { projectId } = req.params;
        const title = String(req.body.newTitle || req.body.title || "").trim();

        if (!isValidObjectId(projectId)) {
            return res.status(400).json({
                message: "No valid project id provided",
                success: false,
            });
        }

        if (!title) {
            return res.status(400).json({
                message: "No title provided",
                success: false,
            });
        }

        const existingProject = await projectModel.findOne({
            _id: { $ne: projectId },
            userId,
            title,
        });

        if (existingProject) {
            return res.status(409).json({
                message: "Project already exists with this name",
                success: false,
            });
        }

        const updatedProject = await projectModel.findOneAndUpdate(
            { _id: projectId, userId },
            { title },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({
                message: "Project not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Project renamed successfully",
            success: true,
            data: await getProjectWithConversations({ projectId, userId }),
        });
    } catch (err) {
        if (err?.code === 11000) {
            return res.status(409).json({
                message: "Project already exists with this name",
                success: false,
            });
        }

        return sendServerError(res, err);
    }
};
