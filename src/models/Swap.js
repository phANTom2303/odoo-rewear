import { Schema, models, model } from "mongoose";

const SwapSchema = new Schema(
  {
    initiator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requested_to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    item_offered: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    item_requested: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
SwapSchema.index({ initiator: 1, status: 1 });
SwapSchema.index({ requested_to: 1, status: 1 });
SwapSchema.index({ status: 1 });

export default models.Swap || model("Swap", SwapSchema);
