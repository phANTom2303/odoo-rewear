"use server";

import connectDB from "../lib/mongodb";
import Item from "../models/Item";
import User from "../models/User";
import mongoose from "mongoose";

export async function createItem(formData, userId) {
  try {
    await connectDB();

    // Validate required fields
    const { name, description, cost, images, condition, tags, size, category } =
      formData;

    if (
      !name ||
      !description ||
      !cost ||
      !images ||
      !condition ||
      !tags ||
      !category
    ) {
      throw new Error("Missing required fields");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    // Validate images array
    if (!Array.isArray(images) || images.length === 0) {
      throw new Error("At least one image is required");
    }

    // Validate tags array
    if (!Array.isArray(tags) || tags.length === 0) {
      throw new Error("At least one tag is required");
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Create the item
    const item = new Item({
      name,
      description,
      cost: parseInt(cost),
      images,
      condition,
      tags,
      size: size || undefined, // Don't save empty string
      category,
    });

    await item.save();

    // Add the item to the user's items array
    await User.findByIdAndUpdate(
      userId,
      { $push: { items: item._id } },
      { new: true }
    );

    return {
      success: true,
      message: "Item created successfully",
      item: {
        id: item._id.toString(),
        name: item.name,
        description: item.description,
        cost: item.cost,
        images: item.images,
        condition: item.condition,
        tags: item.tags,
        size: item.size,
        category: item.category,
        createdAt: item.createdAt,
      },
    };
  } catch (error) {
    console.error("Error creating item:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      throw new Error("An item with similar details already exists");
    }

    throw new Error(error.message || "Failed to create item");
  }
}

export async function getItems(filters = {}) {
  try {
    await connectDB();

    const query = {};

    // Apply filters
    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.condition) {
      query.condition = filters.condition;
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    if (filters.minCost || filters.maxCost) {
      query.cost = {};
      if (filters.minCost) query.cost.$gte = parseInt(filters.minCost);
      if (filters.maxCost) query.cost.$lte = parseInt(filters.maxCost);
    }

    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .limit(filters.limit || 50);

    return {
      success: true,
      items: items.map((item) => ({
        id: item._id.toString(),
        name: item.name,
        description: item.description,
        cost: item.cost,
        images: item.images,
        condition: item.condition,
        tags: item.tags,
        size: item.size,
        category: item.category,
        createdAt: item.createdAt,
      })),
    };
  } catch (error) {
    console.error("Error fetching items:", error);
    throw new Error("Failed to fetch items");
  }
}

export async function getUserItems(userId) {
  try {
    await connectDB();

    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    // Get user with populated items
    const user = await User.findById(userId).populate("items");

    if (!user) {
      throw new Error("User not found");
    }

    return {
      success: true,
      items: user.items.map((item) => ({
        id: item._id.toString(),
        name: item.name,
        description: item.description,
        cost: item.cost,
        images: item.images,
        condition: item.condition,
        tags: item.tags,
        size: item.size,
        category: item.category,
        status: item.status,
        createdAt: item.createdAt,
      })),
    };
  } catch (error) {
    console.error("Error fetching user items:", error);
    throw new Error(error.message || "Failed to fetch user items");
  }
}

export async function getItemById(id) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid item ID");
    }

    const item = await Item.findById(id);

    if (!item) {
      throw new Error("Item not found");
    }

    return {
      success: true,
      item: {
        id: item._id.toString(),
        name: item.name,
        description: item.description,
        cost: item.cost,
        images: item.images,
        condition: item.condition,
        tags: item.tags,
        size: item.size,
        category: item.category,
        createdAt: item.createdAt,
      },
    };
  } catch (error) {
    console.error("Error fetching item:", error);
    throw new Error(error.message || "Failed to fetch item");
  }
}
