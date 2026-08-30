import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { userRepository } from "./user.repositary.js";
import type {
    CreateUserInput,
    LoginInput,
} from "./user.types.js";
import { ApiError as apiError } from "../../Utils/apiResponse.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

class UserService {
    async register(data: CreateUserInput) {
        const existingUser =
            await userRepository.findByEmail(data.email);

        if (existingUser) {
            throw new apiError(
                409,
                "User with this email already exists"
            );
        }

        const hashedPassword =
            await bcrypt.hash(data.password, 12);

        const user = await userRepository.create({
            ...data,
            password: hashedPassword,
        });

        return {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            createdAt: user.createdAt,
        };
    }

    async login(data: LoginInput) {
        const user =
            await userRepository.findByEmailWithPassword(
                data.email
            );

        if (!user) {
            throw new apiError(
                401,
                "Invalid email or password"
            );
        }

        const passwordMatches =
            await bcrypt.compare(
                data.password,
                user.password
            );

        if (!passwordMatches) {
            throw new apiError(
                401,
                "Invalid email or password"
            );
        }

        await userRepository.updateLastLogin(
            user._id.toString()
        );

        const token = jwt.sign(
            {
                userId: user._id.toString(),
            },
            JWT_SECRET as string,
            {
                expiresIn: "7d",
            }
        );

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        };
    }

    async getProfile(userId: string) {
        const user =
            await userRepository.findById(userId);

        if (!user) {
            throw new apiError(
                404,
                "User not found"
            );
        }

        return {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            createdAt: user.createdAt,
        };
    }
}

export const userService = new UserService();