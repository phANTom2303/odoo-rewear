"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Heart, Share2, User, Calendar, Tag } from "lucide-react"
import Header from "@/components/header"
import { supabase } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"

export default function ItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [swapMessage, setSwapMessage] = useState("")

  useEffect(() => {
    loadItemAndUser()
  }, [params.id])

  const loadItemAndUser = async () => {
    try {
      const user = await getCurrentUser()
      setCurrentUser(user)

      const { data: itemData, error } = await supabase
        .from("items")
        .select(`
          *,
          profiles (id, username, full_name, avatar_url)
        `)
        .eq("id", params.id)
        .single()

      if (error) throw error
      setItem(itemData)
    } catch (error) {
      console.error("Error loading item:", error)
      router.push("/browse")
    } finally {
      setLoading(false)
    }
  }

  const handleSwapRequest = async () => {
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    try {
      const { error } = await supabase.from("swaps").insert({
        requester_id: currentUser.id,
        owner_id: item.user_id,
        item_id: item.id,
        message: swapMessage,
      })

      if (error) throw error

      setShowSwapModal(false)
      setSwapMessage("")
      alert("Swap request sent successfully!")
    } catch (error) {
      console.error("Error sending swap request:", error)
      alert("Failed to send swap request")
    }
  }

  const handleRedeemWithPoints = async () => {
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    // Check if user has enough points
    const { data: profile } = await supabase.from("profiles").select("points").eq("id", currentUser.id).single()

    if (profile && profile.points >= item.points_value) {
      if (confirm(`Redeem this item for ${item.points_value} points?`)) {
        try {
          // Deduct points and create swap
          await supabase
            .from("profiles")
            .update({ points: profile.points - item.points_value })
            .eq("id", currentUser.id)

          await supabase.from("swaps").insert({
            requester_id: currentUser.id,
            owner_id: item.user_id,
            item_id: item.id,
            status: "accepted",
            message: "Redeemed with points",
          })

          alert("Item redeemed successfully!")
          router.push("/dashboard")
        } catch (error) {
          console.error("Error redeeming item:", error)
          alert("Failed to redeem item")
        }
      }
    } else {
      alert("Insufficient points to redeem this item")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading item...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Item not found</h2>
          <button onClick={() => router.push("/browse")} className="btn-primary">
            Back to Browse
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="mb-4">
              <img
                src={item.images?.[selectedImageIndex] || "/placeholder.svg?height=500&width=500"}
                alt={item.title}
                className="w-full h-96 object-cover rounded-xl"
              />
            </div>

            {item.images && item.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {item.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? "border-primary-600" : "border-neutral-200"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-neutral-900">{item.title}</h1>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-full border border-neutral-300 hover:bg-neutral-50">
                    <Heart className="h-5 w-5 text-neutral-600" />
                  </button>
                  <button className="p-2 rounded-full border border-neutral-300 hover:bg-neutral-50">
                    <Share2 className="h-5 w-5 text-neutral-600" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-2xl font-bold text-primary-600">{item.points_value} points</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.status === "available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.status === "swapped" ? "Already Swapped" : "Available"}
                </span>
              </div>

              <p className="text-neutral-700 text-lg mb-6">{item.description}</p>

              {/* Item Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-100 p-4 rounded-lg">
                  <p className="text-sm text-neutral-600 mb-1">Category</p>
                  <p className="font-medium text-neutral-900 capitalize">{item.category}</p>
                </div>
                <div className="bg-neutral-100 p-4 rounded-lg">
                  <p className="text-sm text-neutral-600 mb-1">Type</p>
                  <p className="font-medium text-neutral-900 capitalize">{item.type}</p>
                </div>
                <div className="bg-neutral-100 p-4 rounded-lg">
                  <p className="text-sm text-neutral-600 mb-1">Size</p>
                  <p className="font-medium text-neutral-900">{item.size}</p>
                </div>
                <div className="bg-neutral-100 p-4 rounded-lg">
                  <p className="text-sm text-neutral-600 mb-1">Condition</p>
                  <p className="font-medium text-neutral-900 capitalize">{item.condition.replace("_", " ")}</p>
                </div>
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-neutral-600 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {currentUser && currentUser.id !== item.user_id && item.status !== "swapped" && (
                <div className="flex space-x-4 mb-6">
                  <button onClick={() => setShowSwapModal(true)} className="btn-primary flex-1">
                    Request Swap
                  </button>
                  <button onClick={handleRedeemWithPoints} className="btn-secondary flex-1">
                    Redeem ({item.points_value} pts)
                  </button>
                </div>
              )}
            </div>

            {/* Owner Info */}
            <div className="card">
              <h3 className="font-semibold text-neutral-900 mb-4">Listed by</h3>
              <div className="flex items-center space-x-4">
                <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{item.profiles?.full_name}</p>
                  <p className="text-neutral-600">@{item.profiles?.username}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-4 text-sm text-neutral-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Listed {new Date(item.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swap Request Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Request Swap</h3>
            <p className="text-neutral-600 mb-4">
              Send a message to @{item.profiles?.username} about swapping for "{item.title}"
            </p>
            <textarea
              value={swapMessage}
              onChange={(e) => setSwapMessage(e.target.value)}
              placeholder="Hi! I'm interested in swapping for this item..."
              className="w-full h-32 p-3 border border-neutral-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="flex space-x-4 mt-6">
              <button onClick={() => setShowSwapModal(false)} className="btn-outline flex-1">
                Cancel
              </button>
              <button onClick={handleSwapRequest} className="btn-primary flex-1">
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
