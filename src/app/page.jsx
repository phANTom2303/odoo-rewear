"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Recycle,
  Users,
  Award,
  ChevronLeft,
  ChevronRight,
  Leaf,
} from "lucide-react";
import Header from "../components/header";

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/items?featured=true&limit=4");
        const data = await response.json();

        if (data.success) {
          setFeaturedItems(data.items);
        } else {
          setError(data.message || "Failed to fetch items");
        }
      } catch (err) {
        console.error("Error fetching featured items:", err);
        setError("Failed to load featured items");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              Sustainable Fashion
              <span className="block text-primary-600">Starts Here</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
              Join our community of eco-conscious fashion lovers. Swap, share,
              and discover pre-loved clothing while reducing waste and building
              a sustainable wardrobe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* <Link href="/auth/signup" className="btn-primary text-lg px-8 py-3 inline-flex items-center">
                Sign Up
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link> */}
              {/* <Link href="/auth/login" className="btn-outline text-lg px-8 py-3">
                Login
              </Link> */}
              <Link
                href="/browse"
                className="btn-primary text-lg px-8 py-3 inline-flex items-center"
              >
                Start Swapping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/browse" className="btn-outline text-lg px-8 py-3">
                Browse Items
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              How ReWear Works
            </h2>
            <p className="text-lg text-neutral-600">
              Simple, sustainable, and rewarding
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                List Your Items
              </h3>
              <p className="text-neutral-600">
                Upload photos and details of clothes you no longer wear
              </p>
            </div>

            <div className="text-center">
              <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Connect & Swap
              </h3>
              <p className="text-neutral-600">
                Find items you love and propose swaps with other members
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Earn Points
              </h3>
              <p className="text-neutral-600">
                Get points for successful swaps and redeem them for items
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Carousel */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-neutral-900">
              Featured Items
            </h2>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full bg-white shadow-sm border border-neutral-200 hover:bg-neutral-50">
                <ChevronLeft className="h-5 w-5 text-neutral-600" />
              </button>
              <button className="p-2 rounded-full bg-white shadow-sm border border-neutral-200 hover:bg-neutral-50">
                <ChevronRight className="h-5 w-5 text-neutral-600" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="w-full h-48 bg-neutral-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-neutral-200 rounded w-20"></div>
                    <div className="h-3 bg-neutral-200 rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-neutral-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Retry
              </button>
            </div>
          ) : featuredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <Link
                  key={item._id}
                  href={`/items/${item._id}`}
                  className="card hover:shadow-md transition-shadow cursor-pointer"
                >
                  <img
                    src={
                      item.images && item.images.length > 0
                        ? item.images[0]
                        : "/placeholder.svg"
                    }
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg";
                    }}
                  />
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {item.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">
                      Condition:{" "}
                      {item.condition.charAt(0).toUpperCase() +
                        item.condition.slice(1)}
                    </span>
                    <span className="text-primary-600 font-medium">
                      {item.cost} pts
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-600 mb-4">
                No items available at the moment.
              </p>
              <Link href="/create-listing" className="btn-primary">
                List the First Item
              </Link>
            </div>
          )}

          {featuredItems.length > 0 && (
            <div className="text-center mt-8">
              <Link href="/browse" className="btn-primary">
                View All Items
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Wardrobe?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of fashion lovers making sustainable choices every
            day
          </p>
          {/* <Link
            href="/auth/signup"
            className="bg-white text-primary-600 hover:bg-neutral-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link> */}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-6 w-6 text-primary-400" />
                <span className="text-lg font-bold">ReWear</span>
              </div>
              <p className="text-neutral-400">
                Building a sustainable future through community-driven fashion
                exchange.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <Link
                    href="/browse"
                    className="hover:text-white transition-colors"
                  >
                    Browse Items
                  </Link>
                </li>
                <li>
                  <Link
                    href="/add-item"
                    className="hover:text-white transition-colors"
                  >
                    List an Item
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sustainability"
                    className="hover:text-white transition-colors"
                  >
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
            <p>&copy; 2024 ReWear. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
