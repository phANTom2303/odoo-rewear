import { Schema, models, model } from "mongoose";

const ItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["available", "pending", "rejected"],
      default: "pending",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    condition: {
      type: String,
      required: true,
      enum: ["new", "like-new", "excellent", "good", "fair", "poor"],
    },
    tags: {
      type: [String],
      required: true,
      enum: [
        "shirt",
        "t-shirt",
        "blouse",
        "tank-top",
        "sweater",
        "hoodie",
        "cardigan",
        "jacket",
        "coat",
        "blazer",
        "vest",
        "pants",
        "jeans",
        "trousers",
        "shorts",
        "leggings",
        "skirt",
        "dress",
        "jumpsuit",
        "romper",
        "underwear",
        "bra",
        "socks",
        "tights",
        "shoes",
        "sneakers",
        "boots",
        "sandals",
        "heels",
        "flats",
        "accessories",
        "hat",
        "cap",
        "scarf",
        "gloves",
        "belt",
        "bag",
        "purse",
        "backpack",
        "jewelry",
        "watch",
        "sunglasses",
      ],
      validate: {
        validator: function (array) {
          return array.length > 0;
        },
        message: "At least one tag is required",
      },
    },
    size: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "one-size"],
    },
    category: {
      type: String,
      enum: ["men", "women", "unisex", "kids"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
ItemSchema.index({ category: 1, tags: 1 });
ItemSchema.index({ cost: 1 });

export default models.Item || model("Item", ItemSchema);
