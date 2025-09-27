import { SessionOptions } from "iron-session";

// Define the session data structure
export interface SessionData {
  user?: {
    id: number;
    name: string;
    email: string;
    role?: string;
  };
  token?: string;
  isLoggedIn: boolean;
}

// Default session state
export const defaultSession: SessionData = {
  isLoggedIn: false,
};

// Define the session options
export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    "complex_password_at_least_32_characters_long",
  cookieName: "holoo_session",
  ttl: 60 * 60 * 24 * 7, // 1 week
}; 