import type {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";
import { apiError } from "../Utils/apiResponse.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // 1. Prefer HTTP-only cookie
  let token = req.cookies?.accessToken;

  // 2. Optional fallback for API clients
  if (!token) {
    const authorization =
      req.headers.authorization;

    if (authorization?.startsWith("Bearer ")) {
      token = authorization.split(" ")[1];
    }
  }

  if (!token) {
    return next(
      apiError(
        401,
        "Authentication required"
      )
    );
  }

  try {
    const payload = jwt.verify(
      token,
      JWT_SECRET
    ) as {
      userId: string;
    };

    req.user = {
      userId: payload.userId,
    };

    next();
  } catch {
    next(
      apiError(
        401,
        "Invalid or expired token"
      )
    );
  }
};