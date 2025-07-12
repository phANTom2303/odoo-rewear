"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Grid, List } from "lucide-react";
import Header from "../../components/header";
import { useRouter } from "next/navigation";

export default function BrowsePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();

  const categories = ["all", "men", "women", "unisex", "kids"];
  const conditions = [
    "all",
    "new",
    "like-new",
    "excellent",
    "good",
    "fair",
    "poor",
  ];

  const handleItemClick = (item: any) => {
    // Store item data in localStorage
    localStorage.setItem("selectedItem", JSON.stringify(item));
    // Navigate to product page
    router.push("/product");
  };

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory !== "all")
          queryParams.append("category", selectedCategory);
        if (selectedCondition !== "all")
          queryParams.append("condition", selectedCondition);
        if (searchTerm) queryParams.append("search", searchTerm);

        const res = await fetch(`/api/items?${queryParams.toString()}`);
        const data = await res.json();
        setItems(data.items || []);
      } catch (error) {
        console.error("Error loading items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedCategory, selectedCondition, searchTerm]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Browse Items
          </h1>
          <p className="text-neutral-600">
            Discover amazing pre-loved fashion from our community
          </p>
        </div>

        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
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

            <div className="flex flex-wrap items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field w-auto"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all"
                      ? "All Categories"
                      : category.charAt(0).toUpperCase() + category.slice(1)}
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
                      : condition.replace("-", " ").charAt(0).toUpperCase() +
                        condition.replace("-", " ").slice(1)}
                  </option>
                ))}
              </select>

              <div className="flex border border-neutral-300 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-primary-600 text-white"
                      : "text-neutral-600"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-primary-600 text-white"
                      : "text-neutral-600"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

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
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              No items found
            </h3>
            <p className="text-neutral-600 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedCondition("all");
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
                  <div
                    key={item._id}
                    onClick={() => handleItemClick(item)}
                    className="card hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <img
                      src={
                        item.images?.[0] ||
                        "/placeholder.svg?height=200&width=200"
                      }
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-semibold text-neutral-900 mb-2">
                      {item.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600">
                        {item.condition.replace("-", " ")}
                      </span>
                      <span className="text-primary-600 font-medium">
                        {item.cost} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleItemClick(item)}
                    className="card hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center space-x-6">
                      <img
                        src={
                          item.images?.[0] ||
                          "/placeholder.svg?height=100&width=100"
                        }
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-neutral-600 text-sm mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-neutral-500">
                          <span>{item.category}</span>
                          <span>{item.condition.replace("-", " ")}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-medium text-primary-600">
                          {item.cost} pts
                        </span>
                        <p className="text-sm text-neutral-600">
                          Size: {item.size}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
