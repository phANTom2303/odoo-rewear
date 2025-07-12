import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import User from "../../../models/User";

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(MONGODB_URI);
    } catch (error) {
      console.error("Error connecting to MongoDB Database:", error);
    }
  }
}

export default async function AuthCallback({ searchParams }) {
  const session = await auth();
  let userType = searchParams.type;

  if (!session?.user?.email) {
    redirect("/");
  }

  if (!userType || !["customer", "admin"].includes(userType)) {
    redirect("/");
  }

  try {
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: session.user.email });

    if (!existingUser) {
      // Create new user with the specified type
      await User.create({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image?.replace("=s96-c", "=-c"),
        userType: userType,
      });
      console.log(`${userType} user created:`, session.user.email);
    } else {
      userType = existingUser.userType;
    }
  } catch (error) {
    console.error("Error in auth callback:", error);
    redirect("/");
  }

  // Redirect based on user type (outside try-catch to allow NEXT_REDIRECT to work)
  if (userType === "customer") {
    redirect("/dashboard");
  } else if (userType === "admin") {
    redirect("/admin");
  }

  // This should never be reached, but just in case
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Setting up your account...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  );
}
