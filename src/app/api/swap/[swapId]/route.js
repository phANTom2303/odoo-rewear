import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import Swap from '../../../../../models/Swap';
import Item from '../../../../../models/Item';

export async function PATCH(request, { params }) {
  await dbConnect();
  const { swapId } = params;
  const { status } = await request.json();

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ message: 'Invalid status provided' }, { status: 400 });
  }

  try {
    const swap = await Swap.findById(swapId);

    if (!swap) {
      return NextResponse.json({ message: 'Swap request not found' }, { status: 404 });
    }

    if (swap.status !== 'pending') {
      return NextResponse.json({ message: `Swap request is already ${swap.status}` }, { status: 400 });
    }

    swap.status = status;
    await swap.save();

    if (status === 'approved') {
      await Item.findByIdAndUpdate(swap.offeredItemId, { status: 'redeemed' });
      await Item.findByIdAndUpdate(swap.requestedItemId, { status: 'redeemed' });
    } else if (status === 'rejected') {
      await Item.findByIdAndUpdate(swap.offeredItemId, { status: 'available' });
      await Item.findByIdAndUpdate(swap.requestedItemId, { status: 'available' });
    }

    return NextResponse.json({ message: `Swap request ${status} successfully`, swap }, { status: 200 });
  } catch (error) {
    console.error(`Error ${status} swap:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  await dbConnect();
  const { swapId } = params;

  try {
    const swap = await Swap.findById(swapId)
      .populate('requesterId', 'name')
      .populate('receiverId', 'name')
      .populate('offeredItemId', 'name images')
      .populate('requestedItemId', 'name images');

    if (!swap) {
      return NextResponse.json({ message: 'Swap request not found' }, { status: 404 });
    }

    return NextResponse.json({ swap }, { status: 200 });
  } catch (error) {
    console.error('Error fetching swap:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}