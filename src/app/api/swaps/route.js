import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Swap from "../../../models/Swap";
import Item from "../../../models/Item";
import User from "../../../models/User";

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

// GET - Fetch swaps for a user
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type"); // 'initiated' or 'received'

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID is required",
        },
        { status: 400 }
      );
    }

    let query = {};
    if (type === "initiated") {
      query.initiator = userId;
    } else if (type === "received") {
      query.requested_to = userId;
    } else {
      // Get both initiated and received swaps
      query = {
        $or: [{ initiator: userId }, { requested_to: userId }],
      };
    }

    const swaps = await Swap.find(query)
      .populate("initiator", "name email")
      .populate("requested_to", "name email")
      .populate("item_offered", "name images cost condition")
      .populate("item_requested", "name images cost condition")
      .sort({ createdAt: -1 })
      .lean();

    // Convert ObjectIds to strings for JSON serialization
    const serializedSwaps = swaps.map((swap) => ({
      ...swap,
      _id: swap._id.toString(),
      initiator: {
        ...swap.initiator,
        _id: swap.initiator._id.toString(),
      },
      requested_to: {
        ...swap.requested_to,
        _id: swap.requested_to._id.toString(),
      },
      item_offered: {
        ...swap.item_offered,
        _id: swap.item_offered._id.toString(),
      },
      item_requested: {
        ...swap.item_requested,
        _id: swap.item_requested._id.toString(),
      },
      createdAt: swap.createdAt.toISOString(),
      updatedAt: swap.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      swaps: serializedSwaps,
      count: serializedSwaps.length,
    });
  } catch (error) {
    console.error("Error fetching swaps:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch swaps",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// POST - Create a new swap request
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { initiatorId, itemRequestedId, itemOfferedId } = body;

    if (!initiatorId || !itemRequestedId || !itemOfferedId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: initiatorId, itemRequestedId, itemOfferedId",
        },
        { status: 400 }
      );
    }

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(initiatorId) ||
      !mongoose.Types.ObjectId.isValid(itemRequestedId) ||
      !mongoose.Types.ObjectId.isValid(itemOfferedId)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ID format",
        },
        { status: 400 }
      );
    }

    // Get the requested item to find the owner
    const requestedItem = await Item.findById(itemRequestedId);
    if (!requestedItem) {
      return NextResponse.json(
        {
          success: false,
          error: "Requested item not found",
        },
        { status: 404 }
      );
    }

    // Get the offered item to verify ownership
    const offeredItem = await Item.findById(itemOfferedId);
    if (!offeredItem) {
      return NextResponse.json(
        {
          success: false,
          error: "Offered item not found",
        },
        { status: 404 }
      );
    }

    // Find the owner of the requested item by checking which user has this item in their items array
    const itemOwner = await User.findOne({ items: itemRequestedId });
    if (!itemOwner) {
      return NextResponse.json(
        {
          success: false,
          error: "Item owner not found",
        },
        { status: 404 }
      );
    }

    // Verify the offered item belongs to the initiator
    const initiator = await User.findById(initiatorId);
    if (!initiator || !initiator.items.includes(itemOfferedId)) {
      return NextResponse.json(
        {
          success: false,
          error: "You can only offer items that you own",
        },
        { status: 400 }
      );
    }

    // Check if a swap request already exists between these items
    const existingSwap = await Swap.findOne({
      initiator: initiatorId,
      requested_to: itemOwner._id,
      item_offered: itemOfferedId,
      item_requested: itemRequestedId,
      status: "pending",
    });

    if (existingSwap) {
      return NextResponse.json(
        {
          success: false,
          error: "A swap request already exists for these items",
        },
        { status: 400 }
      );
    }

    // Create the swap
    const newSwap = new Swap({
      initiator: initiatorId,
      requested_to: itemOwner._id,
      item_offered: itemOfferedId,
      item_requested: itemRequestedId,
      status: "pending",
    });

    await newSwap.save();

    // Populate the swap for the response
    const populatedSwap = await Swap.findById(newSwap._id)
      .populate("initiator", "name email")
      .populate("requested_to", "name email")
      .populate("item_offered", "name images cost condition")
      .populate("item_requested", "name images cost condition");

    return NextResponse.json({
      success: true,
      message: "Swap request created successfully",
      swap: {
        ...populatedSwap.toObject(),
        _id: populatedSwap._id.toString(),
        initiator: {
          ...populatedSwap.initiator.toObject(),
          _id: populatedSwap.initiator._id.toString(),
        },
        requested_to: {
          ...populatedSwap.requested_to.toObject(),
          _id: populatedSwap.requested_to._id.toString(),
        },
        item_offered: {
          ...populatedSwap.item_offered.toObject(),
          _id: populatedSwap.item_offered._id.toString(),
        },
        item_requested: {
          ...populatedSwap.item_requested.toObject(),
          _id: populatedSwap.item_requested._id.toString(),
        },
        createdAt: populatedSwap.createdAt.toISOString(),
        updatedAt: populatedSwap.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating swap:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create swap request",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT - Update swap status (accept/reject)
export async function PUT(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { swapId, status, userId } = body;

    if (!swapId || !status || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: swapId, status, userId",
        },
        { status: 400 }
      );
    }

    if (!["accepted", "rejected"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Status must be 'accepted' or 'rejected'",
        },
        { status: 400 }
      );
    }

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(swapId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ID format",
        },
        { status: 400 }
      );
    }

    // Find the swap and verify the user is the one being requested
    const swap = await Swap.findById(swapId);
    if (!swap) {
      return NextResponse.json(
        {
          success: false,
          error: "Swap request not found",
        },
        { status: 404 }
      );
    }

    if (swap.requested_to.toString() !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: "You can only respond to swap requests made to you",
        },
        { status: 403 }
      );
    }

    if (swap.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          error: "This swap request has already been responded to",
        },
        { status: 400 }
      );
    }

    // Update the swap status
    swap.status = status;
    await swap.save();

    // Populate the updated swap
    const updatedSwap = await Swap.findById(swapId)
      .populate("initiator", "name email")
      .populate("requested_to", "name email")
      .populate("item_offered", "name images cost condition")
      .populate("item_requested", "name images cost condition");

    return NextResponse.json({
      success: true,
      message: `Swap request ${status} successfully`,
      swap: {
        ...updatedSwap.toObject(),
        _id: updatedSwap._id.toString(),
        initiator: {
          ...updatedSwap.initiator.toObject(),
          _id: updatedSwap.initiator._id.toString(),
        },
        requested_to: {
          ...updatedSwap.requested_to.toObject(),
          _id: updatedSwap.requested_to._id.toString(),
        },
        item_offered: {
          ...updatedSwap.item_offered.toObject(),
          _id: updatedSwap.item_offered._id.toString(),
        },
        item_requested: {
          ...updatedSwap.item_requested.toObject(),
          _id: updatedSwap.item_requested._id.toString(),
        },
        createdAt: updatedSwap.createdAt.toISOString(),
        updatedAt: updatedSwap.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating swap status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update swap status",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
