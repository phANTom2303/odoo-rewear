"use server";

import { auth, signIn } from "../utils/auth";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import User from "../models/User";

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to MongoDB Database");
    } catch (error) {
      console.error("Error connecting to MongoDB Database:", error);
      throw error;
    }
  }
}

export async function signInWithEmailPassword(email, password) {
  try {
    await connectDB();

    // Find user with matching email and password
    const user = await User.findOne({ email, password });

    if (!user) {
      throw new Error("Incorrect username/password");
    }

    // Return user data for session creation
    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        userType: user.userType,
        image: user.image,
        points: user.points,
        rating: user.rating,
      },
    };
  } catch (error) {
    console.error("Sign-in error:", error);
    throw error;
  }
}

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
