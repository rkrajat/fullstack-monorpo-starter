import { Router, type Request, type Response } from "express";

import { authenticateJWT } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { authService } from "../services/auth.service";
import type { LoginRequestBody, RegisterRequestBody } from "../types/api.types";
import { log } from "../utils/logger";
import { sendSuccess, sendUnauthorized, sendInternalError, sendCreated } from "../utils/response";
import { registerSchema, loginSchema } from "../validators/auth.validator";

const router = Router();

// POST /api/auth/register - Register a new user
router.post(
  "/register",
  validateBody(registerSchema),
  async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName } = req.body as RegisterRequestBody;

      // Register user
      const { userId, user } = await authService.register(
        email,
        password,
        firstName,
        lastName
      );

      // Generate JWT token
      const token = authService.generateJwtToken({
        userId,
        email: user.email,
      });

      sendCreated(res, {
        token,
        user,
      });
    } catch (error) {
      log.error("Registration error", error);
      sendInternalError(res, "Failed to register user");
    }
  }
);

// POST /api/auth/login - Login user
router.post(
  "/login",
  validateBody(loginSchema),
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body as LoginRequestBody;

      // Authenticate user
      const { userId, user } = await authService.login(email, password);

      // Generate JWT token
      const token = authService.generateJwtToken({
        userId,
        email: user.email,
      });

      sendSuccess(res, {
        token,
        user,
      });
    } catch (error) {
      log.error("Login error", error);
      sendUnauthorized(res, "Invalid email or password");
    }
  }
);

// GET /api/auth/me - Get current user profile
router.get("/me", authenticateJWT, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      sendUnauthorized(res, "User not authenticated");
      return;
    }

    const userProfile = await authService.getUserProfile(req.user.userId);
    sendSuccess(res, userProfile);
  } catch (error) {
    log.error("Error fetching user profile", error);
    sendInternalError(res, "Failed to fetch user profile");
  }
});

export { router as authRouter };
