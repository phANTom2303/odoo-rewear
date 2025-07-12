import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Item from "../../../models/Item";

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

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 50;
    const featured = searchParams.get("featured") === "true";
    const category = searchParams.get("category");
    const condition = searchParams.get("condition");
    const search = searchParams.get("search");

    // Build query object
    let query = { status: "available" }; // Only show available items

    // Add category filter
    if (category && category !== "all") {
      query.category = category;
    }

    // Add condition filter
    if (condition && condition !== "all") {
      query.condition = condition;
    }

    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    let items;

    if (featured) {
      // Get featured items (most recent items for now)
      items = await Item.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    } else {
      items = await Item.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    }

    // Convert ObjectIds to strings for JSON serialization
    const serializedItems = items.map((item) => ({
      ...item,
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
    console.error("Error fetching items:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch items",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
