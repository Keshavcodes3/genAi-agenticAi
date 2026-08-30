import jwt from 'jsonwebtoken';
import userModel from '../Modules/User/user.model.js';

export const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Check if token exists in cookies
        if (req.cookies?.token && req.cookies.token !== 'none') {
            token = req.cookies.token;
        }
        // 2. Fallback: Check if token exists in the Authorization Header (Bearer <token>)
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // If no token was found in either location, block the request
        if (!token || token === 'none') {
            return res.status(401).json({
                success: false,
                message: 'Access denied. You must be logged in to view this resource.',
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user
        const currentUser = await userModel.findById(decoded.id);

        if (!currentUser) {
            return res.status(401).json({
                success: false,
                message: 'The user belonging to this token no longer exists.',
            });
        }

        // Attach user object to request
        req.user = currentUser;
        next();

    } catch (error) {
        console.error('Auth Middleware Error:', error);

        return res.status(401).json({
            success: false,
            message: 'Session expired or invalid token. Please log in again.',
        });
    }
};