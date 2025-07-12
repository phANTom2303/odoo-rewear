"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Grid, List } from "lucide-react"
import Header from "../../components/header"
import { supabase } from "../../lib/supabase"
import Link from "next/link"

export default function BrowsePage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCondition, setSelectedCondition] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const categories = ["all", "tops", "bottoms", "dresses", "outerwear", "accessories", "shoes"]
  const conditions = ["all", "new", "like_new", "good", "fair", "worn"]

  useEffect(() => {
    loadItems()
  }, [selectedCategory, selectedCondition, searchTerm])

  const loadItems = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from("items")
        .select(`
          *,
          profiles (username, avatar_url)
        `)
        .eq("status", "approved")

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory)
      }

      if (selectedCondition !== "all") {
        query = query.eq("condition", selectedCondition)
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error("Error loading items:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Browse Items</h1>
          <p className="text-neutral-600">Discover amazing pre-loved fashion from our community</p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field w-auto"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="input-field w-auto"
              >
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition === "all"
                      ? "All Conditions"
                      : condition.replace("_", " ").charAt(0).toUpperCase() + condition.replace("_", " ").slice(1)}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-neutral-300 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-primary-600 text-white" : "text-neutral-600"}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-primary-600 text-white" : "text-neutral-600"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-neutral-600">Loading items...</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No items found</h3>
            <p className="text-neutral-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
                setSelectedCondition("all")
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-neutral-600">{items.length} items found</p>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                  <Link key={item.id} href={`/items/${item.id}`}>
                    <div className="card hover:shadow-md transition-shadow cursor-pointer">
                      <img
                        src={item.images?.[0] || "/placeholder.svg?height=200&width=200"}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-semibold text-neutral-900 mb-2">{item.title}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-neutral-600">by @{item.profiles?.username}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600">{item.condition.replace("_", " ")}</span>
                        <span className="text-primary-600 font-medium">{item.points_value} pts</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <Link key={item.id} href={`/items/${item.id}`}>
                    <div className="card hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center space-x-6">
                        <img
                          src={item.images?.[0] || "/placeholder.svg?height=100&width=100"}
                          alt={item.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-neutral-900 mb-1">{item.title}</h3>
                          <p className="text-neutral-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-neutral-500">
                            <span>by @{item.profiles?.username}</span>
                            <span>{item.category}</span>
                            <span>{item.condition.replace("_", " ")}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-medium text-primary-600">{item.points_value} pts</span>
                          <p className="text-sm text-neutral-600">Size: {item.size}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
