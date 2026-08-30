import type { Request, Response, NextFunction } from "express";
import { apiError } from "../Utils/apiResponse.js";

export const notFoundHandler = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    next(apiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
