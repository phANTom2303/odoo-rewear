# 🌟 Odoo ReWear - Community Clothing Exchange

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14.0+-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
</div>

<div align="center">
  <h3>♻️ Revolutionizing Fashion Sustainability Through Smart Swapping ♻️</h3>
  <p>A modern, full-stack platform that connects fashion enthusiasts to swap, trade, and discover pre-loved clothing items while promoting sustainable fashion practices.</p>
</div>

---

## 🎯 **Project Overview**

Odoo ReWear is a comprehensive fashion exchange platform built with modern web technologies. It enables users to list their unused clothing items, discover new styles from other users, and engage in sustainable fashion practices through our innovative swapping system.

### 🌱 **Mission**

To reduce fashion waste and promote sustainable consumption by creating a community-driven platform where fashion lovers can give their clothes a second life.

---

## ✨ **Key Features**

### 👤 **User Management**

- **User Registration & Authentication** - Secure user accounts with profile management
- **Role-Based Access Control** - Customer and Admin user types
- **Points System** - Earn and spend points for transactions

### 👕 **Item Management**

- **Create Listings** - Upload clothing items with detailed descriptions
- **Rich Media Support** - Multiple image uploads for better showcasing
- **Advanced Categorization** - Comprehensive tagging system (shirts, dresses, accessories, etc.)
- **Condition Tracking** - From "new" to "fair" condition ratings
- **Size & Category Filters** - Easy discovery with XS-XXXL sizing and gender categories

### 🔄 **Smart Swapping System**

- **Initiate Swap Requests** - Propose item exchanges with other users
- **Item Selection Modal** - Choose from your available items to offer
- **Status Tracking** - Monitor pending, accepted, and rejected swaps
- **Bilateral Negotiations** - Accept or reject incoming swap requests
- **Swap History** - Complete transaction history and status updates

### 🛍️ **Browse & Discovery**

- **Advanced Search** - Filter by category, condition, size, and tags
- **Featured Items** - Curated selections of trending items
- **Product Details** - Comprehensive item views with multiple images
- **Point-Based Purchasing** - Alternative to swapping for immediate acquisition

### 👨‍💼 **Admin Dashboard**

- **Item Moderation** - Approve, reject, or delete user listings
- **User Management** - Monitor user activities and manage accounts
- **Content Control** - Ensure quality and appropriateness of listings
- **Analytics Overview** - Track platform usage and engagement

### 📱 **User Dashboard**

- **Personal Inventory** - Manage your listed items
- **Swap Management** - Track all your swap requests and responses
- **Activity Feed** - Recent transactions and updates
- **Quick Actions** - Fast access to create listings and browse items

---

## 🏗️ **Technical Architecture**

### **Frontend**

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Modern icon library
- **Responsive Design** - Mobile-first approach

### **Backend**

- **Next.js API Routes** - Serverless backend functions
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - ODM for MongoDB with schema validation
- **RESTful APIs** - Clean and organized endpoint structure

### **Database Schema**

```javascript
// User Model
{
  name: String,
  email: String (unique),
  password: String,
  userType: ["customer", "admin"],
  points: Number (default: 100),
  items: [ObjectId],
  rating: Number (1-5)
}

// Item Model
{
  name: String,
  description: String,
  cost: Number,
  images: [String],
  condition: ["new", "like-new", "excellent", "good", "fair", "poor"],
  tags: [String], // 40+ predefined tags
  size: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "one-size"],
  category: ["men", "women", "unisex", "kids"],
  status: ["available", "pending", "rejected"]
}

// Swap Model
{
  initiator: ObjectId,
  requested_to: ObjectId,
  item_offered: ObjectId,
  item_requested: ObjectId,
  status: ["pending", "accepted", "rejected"]
}
```

---

## 🚀 **Getting Started**

### **Prerequisites**

- Node.js 18.0 or higher
- MongoDB database
- npm, yarn, pnpm, or bun

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/phANTom2303/odoo-rewear.git
   cd odoo-rewear
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 📂 **Project Structure**

```
odoo-rewear/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   │   ├── items/         # Item management
│   │   │   ├── swaps/         # Swap operations
│   │   │   └── users/         # User operations
│   │   ├── browse/            # Item discovery
│   │   ├── create-listing/    # Item creation
│   │   ├── dashboard/         # User dashboard
│   │   ├── login/             # Authentication
│   │   └── product/           # Item details
│   ├── actions/               # Server actions
│   ├── components/            # Reusable UI components
│   ├── models/                # MongoDB schemas
│   │   ├── User.js
│   │   ├── Item.js
│   │   └── Swap.js
│   ├── lib/                   # Utilities
│   └── styles/                # Global styles
├── public/                    # Static assets
└── README.md
```

---

## 🎨 **Screenshots & Demo**

### Homepage & Browse

- Clean, modern interface with intuitive navigation
- Advanced filtering and search capabilities
- Responsive grid layout for optimal viewing

### Swap System

- Interactive modal for item selection
- Real-time status updates
- Comprehensive swap history tracking

### Admin Panel

- Powerful moderation tools
- Item approval workflow
- User management dashboard

---

## 🔮 **Upcoming Features**

- [ ] **Real-time Chat** - In-app messaging for swap negotiations
- [ ] **Advanced Analytics** - Detailed insights for users and admins
- [ ] **Mobile App** - React Native companion app
- [ ] **Social Features** - Follow users, create wishlists
- [ ] **AI Recommendations** - Smart item suggestions
- [ ] **Shipping Integration** - Logistics management for swaps
- [ ] **Environmental Impact** - Track your sustainability contributions

---

## 🤝 **Contributing**

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Development Guidelines**

- Follow TypeScript best practices
- Maintain consistent code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 **Developers**

- **Anish Goenka** - anikavygoenka@gmail.com | [@phANTom2303](https://github.com/phANTom2303)
- **Soumyadeep Kundu** - 2305820@kiit.ac.in | [@VanXodus305](https://github.com/VanXodus305)
- **Saket Saurav** - saketsauravcse@gmail.com | [@sakettt25](https://github.com/sakettt25)
- **Jaspreet Kaur** - jaspreetsk.2020@gmail.com | [@jaspreetjk20](https://github.com/jaspreetjk20)

---

## 🙏 **Acknowledgments**

- **Next.js Team** - For the amazing React framework
- **Vercel** - For seamless deployment solutions
- **MongoDB** - For flexible and scalable database solutions
- **Tailwind CSS** - For beautiful and responsive styling
- **Open Source Community** - For continuous inspiration and support

---

<div align="center">
  <h3>🌍 Join the Sustainable Fashion Revolution! 🌍</h3>
  <p>Every swap makes a difference. Start your sustainable fashion journey today!</p>
  
  **Star ⭐ this repo if you found it helpful!**
</div>
