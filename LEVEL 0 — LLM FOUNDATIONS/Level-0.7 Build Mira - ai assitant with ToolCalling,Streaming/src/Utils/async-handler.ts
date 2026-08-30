import type { NextFunction, Request, Response } from "express";

type AsyncHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<unknown>;

export const asyncHandler =
    (handler: AsyncHandler) =>
        (req: Request, res: Response, next: NextFunction): void => {
            Promise.resolve(handler(req, res, next)).catch(next);
        };