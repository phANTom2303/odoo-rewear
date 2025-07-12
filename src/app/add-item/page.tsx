"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Upload, X } from "lucide-react"
import Header from "../../components/header"
import { supabase } from "../../lib/supabase"
//import { getCurrentUser } from "../../lib/auth"

export default function AddItemPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    size: "",
    condition: "",
    tags: "",
    points_value: 50,
  })
  const router = useRouter()

  const categories = ["tops", "bottoms", "dresses", "outerwear", "accessories", "shoes"]
  const conditions = ["new", "like_new", "good", "fair", "worn"]
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "One Size"]

  useEffect(() => {
    // const checkUser = async () => {
    //   const user = await getCurrentUser()
    //   if (!user) {
    //     router.push("/auth/login")
    //     return
    //   }
    //   setCurrentUser(user)
    // }
    // checkUser()
  }, [router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result && images.length < 5) {
            setImages((prev) => [...prev, e.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    setLoading(true)
    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const { error } = await supabase.from("items").insert({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        size: formData.size,
        condition: formData.condition,
        tags: tagsArray,
        images: images,
        points_value: formData.points_value,
        user_id: currentUser.id,
      })

      if (error) throw error

      alert("Item submitted for review! You'll be notified once it's approved.")
      router.push("/dashboard")
    } catch (error) {
      console.error("Error adding item:", error)
      alert("Failed to add item")
    } finally {
      setLoading(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">List New Item</h1>
          <p className="text-neutral-600">Share your pre-loved fashion with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload */}
          <div className="card">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Photos</h2>
            <p className="text-neutral-600 mb-4">Add up to 5 photos of your item</p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <label className="border-2 border-dashed border-neutral-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
                  <Upload className="h-8 w-8 text-neutral-400 mb-2" />
                  <span className="text-sm text-neutral-600">Add Photo</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Basic Information</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., Vintage Denim Jacket"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-neutral-700 mb-1">
                  Type *
                </label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., Jacket, T-shirt, Jeans"
                />
              </div>

              <div>
                <label htmlFor="size" className="block text-sm font-medium text-neutral-700 mb-1">
                  Size *
                </label>
                <select
                  id="size"
                  name="size"
                  required
                  value={formData.size}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select size</option>
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-neutral-700 mb-1">
                  Condition *
                </label>
                <select
                  id="condition"
                  name="condition"
                  required
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select condition</option>
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition.replace("_", " ").charAt(0).toUpperCase() + condition.replace("_", " ").slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="points_value" className="block text-sm font-medium text-neutral-700 mb-1">
                  Points Value
                </label>
                <input
                  type="number"
                  id="points_value"
                  name="points_value"
                  min="10"
                  max="200"
                  value={formData.points_value}
                  onChange={handleInputChange}
                  className="input-field"
                />
                <p className="text-sm text-neutral-500 mt-1">Suggested: 50-100 points</p>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="input-field resize-none"
                placeholder="Describe your item, including any flaws, styling tips, or special features..."
              />
            </div>

            <div className="mt-6">
              <label htmlFor="tags" className="block text-sm font-medium text-neutral-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="input-field"
                placeholder="vintage, casual, summer, designer (separate with commas)"
              />
              <p className="text-sm text-neutral-500 mt-1">Add tags to help others find your item</p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => router.back()} className="btn-outline">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit for Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
