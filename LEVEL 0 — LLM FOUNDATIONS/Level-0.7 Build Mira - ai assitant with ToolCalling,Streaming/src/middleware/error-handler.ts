import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../Utils/apiResponse.js";

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    let statusCode = 500;
    let message = "Internal Server Error";
    let errors: unknown = undefined;

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
    } else if (err.name === "ValidationError") {
        statusCode = 400;
        message = err.message;
    } else if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    } else if (err.message) {
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(errors ? { errors } : {}),
        ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
    });
};
