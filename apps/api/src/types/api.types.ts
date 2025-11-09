/**
 * JWT Payload structure
 */
export interface JwtPayload {
  userId: string;
  email: string;
}

/**
 * Extended Request user object (added by auth middleware)
 */
export interface RequestUser {
  userId: string;
  email: string;
}

/**
 * User profile response
 */
export interface UserProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Login request body
 */
export interface LoginRequestBody {
  email: string;
  password: string;
}

/**
 * Register request body
 */
export interface RegisterRequestBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Auth response
 */
export interface AuthResponse {
  token: string;
  user: UserProfileResponse;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  status: string;
  message: string;
}

/**
 * Error response
 */
export interface ErrorResponse {
  error: string;
  details?: unknown;
}
