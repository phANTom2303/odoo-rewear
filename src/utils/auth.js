import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import mongoose from "mongoose";
import User from "../models/User";

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log("Connected to MongoDB Database");
    } catch (error) {
      console.error("Error connecting to MongoDB Database:", error);
    }
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      try {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          // We'll handle user creation after sign-in based on the chosen type
          console.log("New user signing in:", user.email);
        } else {
          console.log("User exists:", user.email);
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      // Always fetch user from DB to get latest userType
      try {
        await connectDB();
        const email = user?.email || token?.email;
        if (email) {
          const dbUser = await User.findOne({ email });
          if (dbUser) {
            token.userType = dbUser.userType;
          }
        }
      } catch (error) {
        console.error("Error in jwt callback:", error);
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.userType = token.userType;
      }
      return session;
    },
  },
});
