import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const configSchema = z.object({
  // Server Configuration
  port: z.string().default("4000"),
  nodeEnv: z.enum(["development", "production", "test"]).default("development"),

  // Database Configuration
  mongoUri: z.string().min(1, "MONGO_URI is required"),

  // JWT Configuration
  jwt: z.object({
    secret: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    expiresIn: z.string().default("24h"),
  }),

  // Frontend Configuration
  frontendUrl: z.string().url(),

  // Rate Limiting
  rateLimit: z.object({
    windowMs: z
      .number()
      .int()
      .positive()
      .default(15 * 60 * 1000), // 15 minutes
    maxRequests: z.number().int().positive().default(100),
  }),
});

const parseConfig = () => {
  const rawConfig = {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    mongoUri: process.env.MONGODB_URI,
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
    frontendUrl: process.env.FRONTEND_URL,
    rateLimit: {
      windowMs: process.env.RATE_LIMIT_WINDOW_MS
        ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10)
        : undefined,
      maxRequests: process.env.RATE_LIMIT_MAX_REQUESTS
        ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10)
        : undefined,
    },
  };

  try {
    return configSchema.parse(rawConfig);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((err: z.ZodIssue) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");
      throw new Error(
        `Configuration validation failed:\n${errorMessages}\n\nPlease check your .env file.`
      );
    }
    throw error;
  }
};

export const config = parseConfig();

export type Config = z.infer<typeof configSchema>;
