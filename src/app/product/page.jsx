"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../../components/header";

export default function Productpage() {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Try to get item data from URL parameters first
    const itemData = searchParams.get("data");

    if (itemData) {
      try {
        const parsedItem = JSON.parse(decodeURIComponent(itemData));
        setItem(parsedItem);
        setLoading(false);
        return;
      } catch (error) {
        console.error("Error parsing item data from URL:", error);
      }
    }

    // Try to get item data from localStorage as fallback
    const storedItem = localStorage.getItem("selectedItem");
    if (storedItem) {
      try {
        const parsedItem = JSON.parse(storedItem);
        setItem(parsedItem);
        setLoading(false);
        return;
      } catch (error) {
        console.error("Error parsing item data from localStorage:", error);
      }
    }

    // If no item data found, show error or redirect
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <span className="text-lg text-neutral-500">Loading product...</span>
        </div>
      </div>
    );
  }
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🛍️</div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            No Product Selected
          </h2>
          <p className="text-neutral-600 mb-6">
            Please go back to the browse page and select an item to view.
          </p>
          <a
            href="/browse"
            className="inline-block bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Back to Browse
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <Header />
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Product Displayed */}
          <div className="flex flex-col md:flex-row gap-8 bg-white rounded-2xl shadow p-6 mb-12">
            <div className="w-full md:w-1/2 flex items-center justify-center bg-neutral-100 rounded-xl overflow-hidden min-h-[250px]">
              <img
                src={
                  item.images?.[0] || "/placeholder.svg?height=300&width=300"
                }
                alt={item.name || "Product image"}
                className="w-full h-72 object-cover rounded-xl"
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                  {item.name || "Unnamed Product"}
                </h2>
                <p className="text-neutral-600 mb-4">
                  {item.description || "No description available"}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  )) || (
                    <span className="text-neutral-500 text-sm">
                      No tags available
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold text-neutral-700">
                    Condition:
                  </span>{" "}
                  <span className="capitalize">
                    {item.condition || "Unknown"}
                  </span>
                </p>
                {item.size && (
                  <p>
                    <span className="font-semibold text-neutral-700">
                      Size:
                    </span>{" "}
                    {item.size}
                  </p>
                )}
                <p>
                  <span className="font-semibold text-neutral-700">Cost:</span>{" "}
                  <span className="text-primary-600 font-bold text-lg">
                    {item.cost || 0} points
                  </span>
                </p>
              </div>
              {/* Added Buttons Section */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-md">
                  Buy with Points
                </button>
                <button className="flex-1 bg-neutral-200 text-neutral-800 font-semibold py-3 px-6 rounded-lg hover:bg-neutral-300 transition-colors duration-200 shadow-md">
                  Initiate Swap
                </button>
              </div>
            </div>
          </div>

          {/* Alternate Images */}
          <h3 className="text-xl font-semibold text-neutral-900 mb-4">
            More Images
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {item.images?.slice(1).map((imgSrc, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow flex items-center justify-center h-40 overflow-hidden"
              >
                <img
                  src={imgSrc}
                  alt={`Alternate view ${idx + 1}`}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            )) || (
              <p className="text-neutral-500 col-span-full text-center">
                No additional images available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
