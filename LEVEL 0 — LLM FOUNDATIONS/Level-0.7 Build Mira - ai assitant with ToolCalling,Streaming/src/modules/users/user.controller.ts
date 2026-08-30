import type { Request, Response } from "express";

import { asyncHandler } from "../../Utils/async-handler.js";
import { apiSuccess } from "../../Utils/apiResponse.js";
import { generateAccessToken } from "./user.utils.js";
import {
    registerSchema,
    loginSchema,
} from "./user.validation.js";

import { userService } from "./user.service.js";

export const register = asyncHandler(
    async (req: Request, res: Response) => {
        const data = registerSchema.parse(req.body);

        const user =
            await userService.register(data);
        const token = generateAccessToken(user.id.toString());
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        });
        return apiSuccess(
            res,
            user,
            "Account created successfully",
            201
        );
    }
);

export const login = asyncHandler(
    async (req: Request, res: Response) => {
        const data = loginSchema.parse(req.body);

        const result =
            await userService.login(data);
        const token = result.token;
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        });
        return apiSuccess(
            res,
            result,
            "Login successful"
        );
    }
);

export const getProfile = asyncHandler(
    async (req: Request, res: Response) => {
        const user =
            await userService.getProfile(
                req.user.userId
            );

        return apiSuccess(
            res,
            user,
            "Profile fetched successfully"
        );
    }
);