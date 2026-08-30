import { Router } from "express";

import {
  register,
  login,
  getProfile,
} from "./user.controller.js";

import { authenticate } from "../../middleware/auth.js";

const router = Router();

router.post(
  "/register",

  register
);

router.post(
  "/login",
  login
);

router.get(
  "/me",
  authenticate,
  getProfile
);

export default router;
