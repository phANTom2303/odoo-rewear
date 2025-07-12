"use server";

import { auth } from "../utils/auth";
import { redirect } from "next/navigation";

export async function signInAsCustomer() {
  try {
    await signIn("google", { redirectTo: "/auth/callback?type=customer" });
  } catch (error) {
    // Check if this is a redirect (which is expected behavior)
    if (error.message === "NEXT_REDIRECT") {
      // This is expected - NextAuth is redirecting to Google
      throw error;
    }
    console.error("Customer sign-in error:", error);
    throw error;
  }
}

export async function checkSession() {
  return await auth();
}
