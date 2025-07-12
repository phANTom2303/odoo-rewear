"use server";

import { signIn } from "../utils/auth";

export async function signInAsCustomer() {
  try {
    // Sign in with Google and pass the intended user type
    await signIn("google", { redirectTo: "/auth/callback?type=customer" });
  } catch (error) {
    console.error("Customer sign-in error:", error);
    throw error;
  }
}
