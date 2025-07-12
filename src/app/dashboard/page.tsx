"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Plus, Package, ArrowUpDown, Award, Settings } from "lucide-react"
import Header from "../../components/header"
import { supabase } from "../../lib/supabase"

export default function DashboardPage() {
  const [userItems, setUserItems] = useState<any[]>([])
  const [swaps, setSwaps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Load all items (not just user's)
        const { data: items } = await supabase
          .from("items")
          .select("*")
          .order("created_at", { ascending: false })

        setUserItems(items || [])

        // Load all swaps (not just user's)
        const { data: userSwaps } = await supabase
          .from("swaps")
          .select(`
            *,
            items (title, images),
            profiles!swaps_requester_id_fkey (username),
            profiles!swaps_owner_id_fkey (username)
          `)
          .order("created_at", { ascending: false })

        setSwaps(userSwaps || [])
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [router])

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
    )
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
                  <span className="text-lg font-bold text-secondary-600">0</span>
                </div>
                <p className="text-sm text-neutral-600">Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button onClick={() => router.push("/add-item")} className="card hover:shadow-md transition-shadow text-left">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">List New Item</h3>
                <p className="text-sm text-neutral-600">Add clothes to swap</p>
              </div>
            </div>
          </button>

          <button onClick={() => router.push("/browse")} className="card hover:shadow-md transition-shadow text-left">
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
                <h3 className="font-semibold text-neutral-900">{swaps.length}</h3>
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
              <button onClick={() => router.push("/add-item")} className="btn-primary text-sm">
                Add Item
              </button>
            </div>

            {userItems.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600 mb-4">No items listed yet</p>
                <button onClick={() => router.push("/add-item")} className="btn-primary">
                  List Your First Item
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 border border-neutral-200 rounded-lg">
                    <img
                      src={item.images?.[0] || "/placeholder.svg?height=60&width=60"}
                      alt={item.title}
                      className="w-15 h-15 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-900">{item.title}</h3>
                      <p className="text-sm text-neutral-600">
                        Status: <span className="capitalize">{item.status}</span>
                      </p>
                    </div>
                    <span className="text-primary-600 font-medium">{item.points_value} pts</span>
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
            <h2 className="text-xl font-bold text-neutral-900 mb-6">Recent Swaps</h2>

            {swaps.length === 0 ? (
              <div className="text-center py-8">
                <ArrowUpDown className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600 mb-4">No swaps yet</p>
                <button onClick={() => router.push("/browse")} className="btn-primary">
                  Start Swapping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {swaps.slice(0, 3).map((swap) => (
                  <div key={swap.id} className="flex items-center space-x-4 p-3 border border-neutral-200 rounded-lg">
                    <img
                      src={swap.items?.images?.[0] || "/placeholder.svg?height=60&width=60"}
                      alt={swap.items?.title}
                      className="w-15 h-15 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-900">{swap.items?.title}</h3>
                      <p className="text-sm text-neutral-600">
                        Swap between users
                      </p>
                    </div>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        swap.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : swap.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : swap.status === "declined"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {swap.status}
                    </span>
                  </div>
                ))}
                {swaps.length > 3 && (
                  <button className="w-full text-center text-primary-600 hover:text-primary-700 py-2">
                    View all swaps
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
