import type { Types } from "mongoose";

export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface AuthPayload {
    userId: Types.ObjectId;
}