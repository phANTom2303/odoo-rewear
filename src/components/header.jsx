"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Menu, X, Leaf } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in by looking at session storage
    const checkUser = () => {
      try {
        const userData = sessionStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        if (e.newValue) {
          setUser(JSON.parse(e.newValue));
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSignOut = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <header className="bg-white shadow-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-neutral-900">ReWear</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {user && (
              <>
                <Link
                  href="/browse"
                  className="text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  Browse Items
                </Link>
                <Link
                  href="/dashboard"
                  className="text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/create-listing"
                  className="text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  List Item
                </Link>
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 bg-neutral-200 rounded-full animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary-200"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-neutral-900">
                      {user.name}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {user.points} points
                    </span>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-neutral-600 hover:text-primary-600 transition-colors text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {/* <Link
                  href="/login"
                  className="text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  Sign In
                </Link> */}
                <Link href="/login" className="btn-primary">
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-neutral-600 hover:text-primary-600"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200">
            <div className="flex flex-col space-y-4">
              {loading ? (
                <div className="text-neutral-400">Loading...</div>
              ) : user ? (
                <>
                  <Link
                    href="/browse"
                    className="text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    Browse Items
                  </Link>
                  <div className="flex items-center space-x-3 py-2">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="w-10 h-10 rounded-full object-cover border-2 border-primary-200"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg font-medium">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-neutral-900">
                        {user.name}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {user.points} points
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/create-listing"
                    className="text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    List Item
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-left text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  {/* <Link
                    href="/login"
                    className="text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    Sign In
                  </Link> */}
                  <Link
                    href="/login"
                    className="btn-primary inline-block text-center"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
