import ky from "ky";

import { getToken, removeToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Create ky instance for unauthenticated requests (login, register)
const publicApi = ky.create({
  prefixUrl: API_URL,
  timeout: 30000, // 30 seconds
  retry: {
    limit: 2,
  },
});

// Create ky instance with JWT interceptor for authenticated requests
export const api = ky.create({
  prefixUrl: API_URL,
  timeout: 30000, // 30 seconds
  retry: {
    limit: 2,
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = getToken();

        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        // Handle 401 Unauthorized - token expired or invalid
        if (response.status === 401) {
          removeToken();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        return response;
      },
    ],
  },
});

// Auth API methods
export const authApi = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<{
    token: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
  }> => {
    return publicApi.post("api/auth/register", { json: data }).json();
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<{
    token: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
  }> => {
    return publicApi.post("api/auth/login", { json: data }).json();
  },

  me: async (): Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }> => {
    return api.get("api/auth/me").json();
  },
};
