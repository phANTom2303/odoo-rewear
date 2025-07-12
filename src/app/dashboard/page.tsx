"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Plus, Package, ArrowUpDown, Award } from "lucide-react";
import Header from "../../components/header";

export default function DashboardPage() {
  const [userItems, setUserItems] = useState<any[]>([]);
  const [swaps, setSwaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  // Get current user from session storage
  useEffect(() => {
    const getUserData = () => {
      try {
        const userData = sessionStorage.getItem("user");
        if (userData) {
          setCurrentUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      fetchData();
    }
  }, [currentUser]);

  const fetchData = async () => {
    if (!currentUser?.id) return;

    try {
      // Fetch user's items
      const itemsRes = await fetch(`/api/users/items?userId=${currentUser.id}`);
      const itemsData = await itemsRes.json();

      // Fetch user's swaps (both initiated and received)
      const swapsRes = await fetch(`/api/swaps?userId=${currentUser.id}`);
      const swapsData = await swapsRes.json();

      setUserItems(itemsData.items || []);
      setSwaps(swapsData.swaps || []);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapResponse = async (
    swapId: string,
    status: "accepted" | "rejected"
  ) => {
    if (!currentUser?.id) {
      alert("Please log in to respond to swaps");
      return;
    }

    try {
      const response = await fetch("/api/swaps", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          swapId,
          status,
          userId: currentUser.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Swap request ${status} successfully!`);
        // Refresh the swaps data
        const swapsRes = await fetch(`/api/swaps?userId=${currentUser.id}`);
        const swapsData = await swapsRes.json();
        setSwaps(swapsData.swaps || []);
      } else {
        alert(`Failed to ${status} swap request: ${data.error}`);
      }
    } catch (error) {
      console.error(`Error ${status}ing swap:`, error);
      alert(`Failed to ${status} swap request`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex items-center space-x-6">
            <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-primary-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-neutral-900">Welcome</h1>
              <p className="text-neutral-600">Browse and swap clothes</p>
            </div>
            <div className="text-center">
              <div className="bg-secondary-100 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-secondary-600" />
                  <span className="text-lg font-bold text-secondary-600">
                    0
                  </span>
                </div>
                <p className="text-sm text-neutral-600">Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => router.push("/create-listing")}
            className="card hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">
                  List New Item
                </h3>
                <p className="text-sm text-neutral-600">Add clothes to swap</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/browse")}
            className="card hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-secondary-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-secondary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">Browse Items</h3>
                <p className="text-sm text-neutral-600">Find new clothes</p>
              </div>
            </div>
          </button>

          <div className="card">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <ArrowUpDown className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">
                  {swaps.length}
                </h3>
                <p className="text-sm text-neutral-600">Active Swaps</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Listings */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Listings</h2>
              <button
                onClick={() => router.push("/create-listing")}
                className="btn-primary text-sm"
              >
                Add Item
              </button>
            </div>

            {userItems.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600 mb-4">No items listed yet</p>
                <button
                  onClick={() => router.push("/create-listing")}
                  className="btn-primary"
                >
                  List Your First Item
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userItems.slice(0, 3).map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center space-x-4 p-4 border border-neutral-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <img
                      src={
                        item.images?.[0] ||
                        "/placeholder.svg?height=60&width=60"
                      }
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-neutral-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        Status:{" "}
                        <span
                          className={`capitalize px-2 py-1 text-xs rounded-full ${
                            item.status === "available"
                              ? "bg-green-100 text-green-800"
                              : item.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </p>
                      <p className="text-xs text-neutral-500 capitalize">
                        {item.condition} • {item.category}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-primary-600 font-semibold text-lg">
                        {item.cost}
                      </span>
                      <p className="text-xs text-neutral-500">points</p>
                    </div>
                  </div>
                ))}
                {userItems.length > 3 && (
                  <button className="w-full text-center text-primary-600 hover:text-primary-700 py-2">
                    View all {userItems.length} items
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Recent Swaps */}
          <div className="card">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">
              Recent Swaps
            </h2>

            {swaps.length === 0 ? (
              <div className="text-center py-8">
                <ArrowUpDown className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600 mb-4">No swaps yet</p>
                <button
                  onClick={() => router.push("/browse")}
                  className="btn-primary"
                >
                  Start Swapping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {swaps.slice(0, 5).map((swap) => (
                  <div
                    key={swap._id}
                    className="border border-neutral-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-neutral-900 mb-1">
                          {swap.initiator._id === currentUser?.id
                            ? `Swap request sent to ${swap.requested_to.name}`
                            : `Swap request from ${swap.initiator.name}`}
                        </h3>
                        <p className="text-sm text-neutral-600">
                          {new Date(swap.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`text-sm px-3 py-1 rounded-full ${
                          swap.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : swap.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {swap.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">
                          {swap.initiator._id === currentUser?.id
                            ? "You're offering:"
                            : "They're offering:"}
                        </p>
                        <div className="flex items-center space-x-2">
                          <img
                            src={
                              swap.item_offered.images?.[0] ||
                              "/placeholder.svg?height=40&width=40"
                            }
                            alt={swap.item_offered.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {swap.item_offered.name}
                            </p>
                            <p className="text-xs text-neutral-600">
                              {swap.item_offered.cost} pts
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">
                          {swap.initiator._id === currentUser?.id
                            ? "You want:"
                            : "They want:"}
                        </p>
                        <div className="flex items-center space-x-2">
                          <img
                            src={
                              swap.item_requested.images?.[0] ||
                              "/placeholder.svg?height=40&width=40"
                            }
                            alt={swap.item_requested.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {swap.item_requested.name}
                            </p>
                            <p className="text-xs text-neutral-600">
                              {swap.item_requested.cost} pts
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Show accept/reject buttons only for received pending requests */}
                    {swap.requested_to._id === currentUser?.id &&
                      swap.status === "pending" && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleSwapResponse(swap._id, "accepted")
                            }
                            className="flex-1 bg-green-600 text-white text-sm py-2 px-3 rounded hover:bg-green-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleSwapResponse(swap._id, "rejected")
                            }
                            className="flex-1 bg-red-600 text-white text-sm py-2 px-3 rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                  </div>
                ))}
                {swaps.length > 5 && (
                  <button className="w-full text-center text-primary-600 hover:text-primary-700 py-2">
                    View all {swaps.length} swaps
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
