import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

export const generateAccessToken = (
    userId: string
) => {
    return jwt.sign(
        {
            userId,
        },
        JWT_SECRET,
        {
            expiresIn: "15m",
        }
    );
};