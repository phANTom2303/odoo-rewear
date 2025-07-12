import { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    image: String,
    userType: {
      type: String,
      enum: ["customer", "admin"],
      required: true,
    },
    points: {
      type: Number,
      default: 100,
      min: 0,
    },
    items: [

      
      {
        type: Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
      validate: {
        validator: function (value) {
          return value === null || (value >= 1 && value <= 5);
        },
        message: "Rating must be between 1 and 5",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default models.User || model("User", UserSchema);
