"use server";
import { getIronSession } from "iron-session";
import { sealData } from "iron-session";
import { cookies } from "next/headers";
import { defaultSession, SessionData } from "./sessionConfig";
import { sessionOptions } from "./sessionConfig";

// Server-side only function to get session
export async function getSession(): Promise<SessionData> {
  try {
    // According to Next.js docs, cookies() is an async function
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );

    if (!session) {
      return defaultSession;
    }

    return session;
  } catch (error) {
    console.error("Failed to get or unseal session:", error);
    return defaultSession;
  }
}

// Server-side only function to save session
export async function saveSession(session: SessionData): Promise<Response> {
  const encryptedSession = await sealData(session, sessionOptions);

  // Create a dummy response to set the cookie
  const response = new Response(null, {
    status: 200,
  });

  // Set the cookie
  response.headers.set(
    "Set-Cookie",
    `${
      sessionOptions.cookieName
    }=${encryptedSession}; Path=/; HttpOnly; SameSite=Strict; ${
      process.env.NODE_ENV === "production" ? "Secure;" : ""
    } Max-Age=${sessionOptions.ttl}`,
  );

  return response;
}
