import mongoose from "mongoose";

// MongoDB connection
const MONGODB_URI =
  "mongodb+srv://jass-force:1234567890@cluster0.uoatowq.mongodb.net/development?retryWrites=true&w=majority&appName=Cluster0" ||
  "mongodb://localhost:27017/odoo-rewear";

// Item Schema Definition
const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
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
      required: true,
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

// User Schema Definition
const UserSchema = new mongoose.Schema(
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
        type: mongoose.Schema.Types.ObjectId,
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

// Index for better query performance
ItemSchema.index({ category: 1, tags: 1 });
ItemSchema.index({ cost: 1 });

// Create the models
const Item = mongoose.models.Item || mongoose.model("Item", ItemSchema);
const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log("Connected to MongoDB Database");
    } catch (error) {
      console.error("Error connecting to MongoDB Database:", error);
      process.exit(1);
    }
  }
}

// Sample clothing items data
const sampleItems = [
  {
    name: "Vintage Levi's 501 Jeans",
    description:
      "Classic straight-leg denim jeans in excellent condition. Timeless style that never goes out of fashion.",
    cost: 45,
    images: [],
    condition: "excellent",
    tags: ["jeans", "pants"],
    size: "M",
    category: "unisex",
  },
  {
    name: "Nike Air Max Sneakers",
    description:
      "Comfortable running shoes with air cushioning. Perfect for everyday wear or light workouts.",
    cost: 85,
    images: [],
    condition: "like-new",
    tags: ["sneakers", "shoes"],
    size: "L",
    category: "unisex",
  },
  {
    name: "Elegant Black Dress",
    description:
      "Sophisticated little black dress perfect for evening events or professional occasions.",
    cost: 60,
    images: [],
    condition: "excellent",
    tags: ["dress"],
    size: "S",
    category: "women",
  },
  {
    name: "Wool Winter Coat",
    description:
      "Warm and stylish winter coat made from premium wool. Great for cold weather.",
    cost: 120,
    images: [],
    condition: "good",
    tags: ["coat", "jacket"],
    size: "L",
    category: "unisex",
  },
  {
    name: "Casual Cotton T-Shirt",
    description:
      "Soft cotton t-shirt in navy blue. Perfect for casual everyday wear.",
    cost: 15,
    images: [],
    condition: "excellent",
    tags: ["t-shirt"],
    size: "M",
    category: "men",
  },
  {
    name: "Designer Leather Handbag",
    description:
      "Luxury leather handbag with multiple compartments. Excellent craftsmanship and design.",
    cost: 200,
    images: [],
    condition: "like-new",
    tags: ["bag", "purse", "accessories"],
    size: "one-size",
    category: "women",
  },
  {
    name: "Denim Jacket",
    description:
      "Classic blue denim jacket that pairs well with any outfit. Vintage style.",
    cost: 35,
    images: [],
    condition: "good",
    tags: ["jacket"],
    size: "M",
    category: "unisex",
  },
  {
    name: "Silk Blouse",
    description:
      "Elegant silk blouse in cream color. Perfect for professional or formal occasions.",
    cost: 55,
    images: [],
    condition: "excellent",
    tags: ["blouse"],
    size: "S",
    category: "women",
  },
  {
    name: "Athletic Shorts",
    description:
      "Moisture-wicking athletic shorts perfect for workouts or sports activities.",
    cost: 25,
    images: [],
    condition: "like-new",
    tags: ["shorts"],
    size: "L",
    category: "men",
  },
  {
    name: "Cashmere Sweater",
    description:
      "Luxurious cashmere sweater in light gray. Incredibly soft and warm.",
    cost: 95,
    images: [],
    condition: "excellent",
    tags: ["sweater"],
    size: "M",
    category: "women",
  },
  {
    name: "Leather Boots",
    description:
      "Genuine leather ankle boots with a comfortable fit. Great for fall and winter.",
    cost: 110,
    images: [],
    condition: "good",
    tags: ["boots", "shoes"],
    size: "L",
    category: "unisex",
  },
  {
    name: "Floral Summer Dress",
    description:
      "Light and airy summer dress with beautiful floral print. Perfect for warm weather.",
    cost: 40,
    images: [],
    condition: "excellent",
    tags: ["dress"],
    size: "M",
    category: "women",
  },
  {
    name: "Button-Up Shirt",
    description:
      "Classic white button-up shirt suitable for business or casual wear.",
    cost: 30,
    images: [],
    condition: "excellent",
    tags: ["shirt"],
    size: "L",
    category: "men",
  },
  {
    name: "Yoga Leggings",
    description:
      "High-quality yoga leggings with four-way stretch. Comfortable and breathable.",
    cost: 35,
    images: [],
    condition: "like-new",
    tags: ["leggings"],
    size: "S",
    category: "women",
  },
  {
    name: "Baseball Cap",
    description:
      "Adjustable baseball cap in classic black. Perfect for sunny days.",
    cost: 20,
    images: [],
    condition: "good",
    tags: ["cap", "hat", "accessories"],
    size: "one-size",
    category: "unisex",
  },
  {
    name: "Formal Blazer",
    description:
      "Professional navy blazer perfect for business meetings and formal events.",
    cost: 75,
    images: [],
    condition: "excellent",
    tags: ["blazer"],
    size: "M",
    category: "men",
  },
  {
    name: "Maxi Skirt",
    description:
      "Flowing maxi skirt in burgundy color. Comfortable and stylish for any occasion.",
    cost: 45,
    images: [],
    condition: "like-new",
    tags: ["skirt"],
    size: "M",
    category: "women",
  },
  {
    name: "Hoodie Sweatshirt",
    description:
      "Comfortable cotton hoodie in charcoal gray. Perfect for casual wear and layering.",
    cost: 40,
    images: [],
    condition: "good",
    tags: ["hoodie"],
    size: "L",
    category: "unisex",
  },
  {
    name: "Canvas Sneakers",
    description:
      "Classic white canvas sneakers. Versatile and comfortable for everyday wear.",
    cost: 50,
    images: [],
    condition: "excellent",
    tags: ["sneakers", "shoes"],
    size: "M",
    category: "unisex",
  },
  {
    name: "Wool Scarf",
    description:
      "Soft wool scarf in plaid pattern. Warm and stylish accessory for cold weather.",
    cost: 25,
    images: [],
    condition: "excellent",
    tags: ["scarf", "accessories"],
    size: "one-size",
    category: "unisex",
  },
  {
    name: "Tank Top",
    description:
      "Lightweight cotton tank top in white. Perfect for layering or warm weather.",
    cost: 12,
    images: [],
    condition: "good",
    tags: ["tank-top"],
    size: "S",
    category: "women",
  },
  {
    name: "Chino Pants",
    description:
      "Smart casual chino pants in khaki. Versatile for both work and weekend wear.",
    cost: 40,
    images: [],
    condition: "excellent",
    tags: ["pants", "trousers"],
    size: "L",
    category: "men",
  },
  {
    name: "Cardigan Sweater",
    description:
      "Cozy knit cardigan in cream color. Perfect for layering in transitional weather.",
    cost: 50,
    images: [],
    condition: "like-new",
    tags: ["cardigan", "sweater"],
    size: "M",
    category: "women",
  },
  {
    name: "Leather Belt",
    description:
      "Genuine leather belt in brown with classic buckle. Essential accessory for any wardrobe.",
    cost: 30,
    images: [],
    condition: "good",
    tags: ["belt", "accessories"],
    size: "L",
    category: "unisex",
  },
  {
    name: "Summer Jumpsuit",
    description:
      "Comfortable one-piece jumpsuit in navy blue. Perfect for casual summer days.",
    cost: 55,
    images: [],
    condition: "excellent",
    tags: ["jumpsuit"],
    size: "M",
    category: "women",
  },
];

async function seedDatabase() {
  try {
    await connectDB();

    console.log("Clearing existing data...");
    await Item.deleteMany({});
    await User.deleteMany({});

    console.log("Adding sample items...");
    const createdItems = await Item.insertMany(sampleItems);
    console.log(
      `Successfully added ${createdItems.length} items to the database.`
    );

    // Create sample users
    console.log("Creating sample users...");

    const sampleUsers = [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&q=80",
        userType: "customer",
        points: 150,
        rating: 4.5,
      },
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        password: "password456",
        image:
          "https://images.unsplash.com/photo-1494790108755-2616b2639146?w=150&h=150&fit=crop&crop=face&q=80",
        userType: "customer",
        points: 200,
        rating: 4.8,
      },
    ];

    // Assign first 10 items to John Doe and next 10 items to Jane Smith
    sampleUsers[0].items = createdItems.slice(0, 10).map((item) => item._id);
    sampleUsers[1].items = createdItems.slice(10, 20).map((item) => item._id);

    const createdUsers = await User.insertMany(sampleUsers);

    console.log(`Successfully created ${createdUsers.length} users:`);
    createdUsers.forEach((user, index) => {
      console.log(
        `${index + 1}. ${user.name} (${user.email}) - ${user.userType} - ${
          user.items.length
        } items`
      );
    });

    console.log("\nUser-Item Associations:");
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      console.log(`\n${user.name}'s items:`);
      const userItems = createdItems.slice(i * 10, (i + 1) * 10);
      userItems.forEach((item, itemIndex) => {
        console.log(`  ${itemIndex + 1}. ${item.name} - $${item.cost}`);
      });
    }

    console.log("\nDatabase seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

// Run the script
seedDatabase();
