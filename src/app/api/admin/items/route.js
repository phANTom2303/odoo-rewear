import { NextResponse } from "next/server";
import mongoose from "mongoose";
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

// GET - Fetch items by status (pending, available, etc.)
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "pending";
    const limit = parseInt(searchParams.get("limit")) || 50;

    let query = {};
    if (status !== "all") {
      query.status = status;
    }

    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Convert ObjectIds to strings for JSON serialization
    const serializedItems = items.map((item) => ({
      ...item,
      _id: item._id.toString(),
      id: item._id.toString(), // Add id field for consistency
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      items: serializedItems,
      count: serializedItems.length,
    });
  } catch (error) {
    console.error("Error fetching admin items:", error);
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

// PUT - Update item status (approve/reject)
export async function PUT(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { itemId, status, action } = body;

    if (!itemId || !action) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: itemId and action",
        },
        { status: 400 }
      );
    }

    // Validate action and set appropriate status
    let newStatus;
    if (action === "approve") {
      newStatus = "available";
    } else if (action === "reject") {
      newStatus = "rejected";
    } else if (status) {
      newStatus = status;
    } else {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid action. Use 'approve', 'reject' or provide a valid status",
        },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid item ID",
        },
        { status: 400 }
      );
    }

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { status: newStatus },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return NextResponse.json(
        {
          success: false,
          error: "Item not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Item ${action}d successfully`,
      item: {
        ...updatedItem.toObject(),
        _id: updatedItem._id.toString(),
        id: updatedItem._id.toString(),
        createdAt: updatedItem.createdAt.toISOString(),
        updatedAt: updatedItem.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating item status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update item status",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete an item
export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing itemId parameter",
        },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid item ID",
        },
        { status: 400 }
      );
    }

    const deletedItem = await Item.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return NextResponse.json(
        {
          success: false,
          error: "Item not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Item deleted successfully",
      item: {
        ...deletedItem.toObject(),
        _id: deletedItem._id.toString(),
        id: deletedItem._id.toString(),
      },
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete item",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
