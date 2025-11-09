import bcrypt from "bcrypt";
import type { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

import { config } from "../config";
import { User } from "../models/User";
import type { JwtPayload, UserProfileResponse } from "../types/api.types";
import {
  UnauthorizedError,
  InternalServerError,
  ConflictError,
} from "../utils/error";
import { log } from "../utils/logger";

/**
 * Auth Service
 * Handles authentication, JWT operations, and user management
 */
export class AuthService {
  /**
   * Register a new user
   * Passwords are hashed using bcrypt before storing
   */
  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<{ userId: string; user: UserProfileResponse }> {
    try {
      log.info("Registering new user", { email });

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ConflictError("User with this email already exists");
      }

      // Hash password with bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user with hashed password
      const user = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      log.info("User registered successfully", { userId: user._id, email });

      return {
        userId: String(user._id),
        user: {
          id: String(user._id),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    } catch (error) {
      if (error instanceof ConflictError) {
        throw error;
      }
      log.error("Failed to register user", error);
      throw new InternalServerError("Failed to register user", error);
    }
  }

  /**
   * Login user with email and password
   * Verifies password using bcrypt.compare()
   */
  async login(
    email: string,
    password: string
  ): Promise<{ userId: string; user: UserProfileResponse }> {
    try {
      log.info("User login attempt", { email });

      // Find user by email
      const user = await User.findOne({ email });

      console.log("user", user);
      if (!user) {
        throw new UnauthorizedError("Invalid email or password");
      }

      // Verify password using bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid email or password");
      }

      log.info("User logged in successfully", { userId: user._id, email });

      return {
        userId: String(user._id),
        user: {
          id: String(user._id),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      log.error("Failed to login user", error);
      throw new InternalServerError("Failed to login", error);
    }
  }

  /**
   * Get user profile by user ID
   */
  async getUserProfile(userId: string): Promise<UserProfileResponse> {
    try {
      log.info("Fetching user profile", { userId });

      const user = await User.findById(userId);

      if (!user) {
        log.warn("User not found", { userId });
        throw new UnauthorizedError("User not found");
      }

      return {
        id: String(user._id),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      log.error("Failed to fetch user profile", error, { userId });
      throw new InternalServerError("Failed to fetch user profile", error);
    }
  }

  /**
   * Generate JWT token for authenticated user
   */
  generateJwtToken(payload: JwtPayload): string {
    try {
      log.info("Generating JWT token", { userId: payload.userId });

      const token = jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
      } as unknown as SignOptions);

      return token;
    } catch (error) {
      log.error("Failed to generate JWT token", error);
      throw new InternalServerError("Failed to generate authentication token");
    }
  }

  /**
   * Verify and decode JWT token
   */
  verifyJwtToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        log.warn("JWT token expired");
        throw new UnauthorizedError("Authentication token expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        log.warn("Invalid JWT token");
        throw new UnauthorizedError("Invalid authentication token");
      }
      log.error("Failed to verify JWT token", error);
      throw new UnauthorizedError("Authentication failed");
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
