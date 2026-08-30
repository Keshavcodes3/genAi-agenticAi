const stores = new Map();

const getClientKey = (req, keyPrefix) => {
    const userId = req.user?.id;
    const forwardedFor = req.headers["x-forwarded-for"]?.split(",")[0]?.trim();
    const ip = forwardedFor || req.ip || req.socket?.remoteAddress || "unknown";

    return `${keyPrefix}:${userId || ip}`;
};

export const rateLimit = ({
    windowMs = 60 * 1000,
    limit = 60,
    keyPrefix = "global",
    message = "Too many requests. Please try again later.",
} = {}) => {
    if (!stores.has(keyPrefix)) {
        stores.set(keyPrefix, new Map());
    }

    const store = stores.get(keyPrefix);

    return (req, res, next) => {
        const now = Date.now();
        const key = getClientKey(req, keyPrefix);
        const current = store.get(key);

        if (!current || current.resetAt <= now) {
            const resetAt = now + windowMs;
            store.set(key, { count: 1, resetAt });

            res.setHeader("RateLimit-Limit", limit);
            res.setHeader("RateLimit-Remaining", Math.max(limit - 1, 0));
            res.setHeader("RateLimit-Reset", Math.ceil(resetAt / 1000));
            return next();
        }

        current.count += 1;
        const remaining = Math.max(limit - current.count, 0);

        res.setHeader("RateLimit-Limit", limit);
        res.setHeader("RateLimit-Remaining", remaining);
        res.setHeader("RateLimit-Reset", Math.ceil(current.resetAt / 1000));

        if (current.count > limit) {
            const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000);
            res.setHeader("Retry-After", retryAfterSeconds);

            return res.status(429).json({
                message,
                success: false,
                retryAfter: retryAfterSeconds,
            });
        }

        return next();
    };
};

export const apiRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    keyPrefix: "api",
    message: "Too many requests from this client. Please slow down.",
});

export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    keyPrefix: "auth",
    message: "Too many auth attempts. Please try again in a few minutes.",
});

export const chatRateLimit = rateLimit({
    windowMs: 60 * 1000,
    limit: 12,
    keyPrefix: "chat",
    message: "Too many chat requests. Please wait a moment before sending more.",
});
