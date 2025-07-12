import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Swap from '../../../../models/Swap';
import Item from '../../../../models/Item';
import User from '../../../../models/User';

export async function POST(request) {
  await dbConnect();

  try {
    const { offeredItemId, requestedItemId, requesterId, receiverId } = await request.json();

    // Validate that both items exist and are available
    const offeredItem = await Item.findById(offeredItemId);
    const requestedItem = await Item.findById(requestedItemId);

    if (!offeredItem || !requestedItem) {
      return NextResponse.json({ message: 'One or both items not found' }, { status: 404 });
    }

    if (offeredItem.status !== 'available' || requestedItem.status !== 'available') {
      return NextResponse.json({ message: 'One or both items are not available for swap' }, { status: 400 });
    }

    // Check if either item is already part of an active swap
    const existingSwap = await Swap.findOne({
      $or: [
        { offeredItemId: offeredItemId, status: 'pending' },
        { requestedItemId: offeredItemId, status: 'pending' },
        { offeredItemId: requestedItemId, status: 'pending' },
        { requestedItemId: requestedItemId, status: 'pending' },
      ],
    });

    if (existingSwap) {
      return NextResponse.json({ message: 'One of the items is already involved in a pending swap' }, { status: 400 });
    }

    // Create the new swap request
    const newSwap = await Swap.create({
      requesterId,
      receiverId,
      offeredItemId,
      requestedItemId,
      status: 'pending',
    });

    // Update item statuses to 'in-swap-process'
    await Item.findByIdAndUpdate(offeredItemId, { status: 'in-swap-process' });
    await Item.findByIdAndUpdate(requestedItemId, { status: 'in-swap-process' });

    return NextResponse.json({ message: 'Swap request initiated successfully', swap: newSwap }, { status: 201 });
  } catch (error) {
    console.error('Error initiating swap:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}