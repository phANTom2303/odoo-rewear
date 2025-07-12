import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "../../../../models/User";
import Item from "../../../../models/Item";

// MongoDB connection
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

// GET - Fetch user's items
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    console.log("Fetching items for userId:", userId); // Debug log

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID is required",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid user ID format",
        },
        { status: 400 }
      );
    }

    // Find the user and populate their items
    const user = await User.findById(userId).populate({
      path: "items",
      match: { status: "available" }, // Only show available items for swapping
    });

    console.log("Found user:", user ? "Yes" : "No"); // Debug log
    console.log("User items count:", user ? user.items.length : 0); // Debug log

    if (!user) {
      // For demo purposes, if user not found, return empty array
      // In a real app, this would return an error
      return NextResponse.json({
        success: true,
        items: [],
        count: 0,
        message: "User not found, returning empty items list",
      });
    }

    // Convert ObjectIds to strings for JSON serialization
    const serializedItems = user.items.map((item) => ({
      ...item.toObject(),
      _id: item._id.toString(),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      items: serializedItems,
      count: serializedItems.length,
    });
  } catch (error) {
    console.error("Error fetching user items:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user items",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
