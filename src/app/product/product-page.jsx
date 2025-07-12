"use client";
import { useEffect, useState } from "react";

export default function Productpage({item}) {
//   const [item, setItem] = useState(null);

//   useEffect(() => {
//     const mockData = {
//       name: "Vintage Denim Jacket",
//       description: "A classic blue denim jacket with a comfortable fit and timeless style.",
//       cost: 150,
//       images: [
//         "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRhffebP9pO--l9cvo_LDqt6J_xvCpxgRQso8Uk3nU3NOQrAkx3gUt8f-pUv0ncS3YOkitGSjH6isuvkDot_WIELJtnNZ8AVU49bmVil78dq9JIr6o6PPiO",
//         "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQ6Mhmntq1fzSN6NKxJdUr36urdI5bR2tui_3u1xXWGNx2ppZPKuUGWxjFZJM2c5m59YlJO0vpAH4tMpB-kYCCk9HbB2XCXJKyi8lMoJw2Z",
//         "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRzAobCUVIGW4oIzLCLIxF4oFr-aYN3kLKS-AAP2lbhy7BkZ4nuEVGxvIQFutxeSQuWw0GrdWt1NxGvnv5faFFAW0OQJe7SZ-T1qHVLKsk",
//         "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR8umqN-BlQM6XKXEMy15b8ekNRV2XsauFgTnDXV6scRztW8D7tDNc8pQHSOwpsR-KsNH7lOhf0Fofwr1_IP_bC4iV9KNdayQd6TXxR-TXmT_bdqLRJh4twMw",
//         "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTx3pUlKjequDrH3jCyN4jgnFAnaCNX8IMjozFzmPaHTEwbPexSFIIycZiCIMfNA4hfUl-f4TvaOrPzmbfflaexep2uJhNEi0zfOfY-BM3kbLcgY2gsnBrH"
//       ],
//       condition: "excellent",
//       tags: ["jacket", "coat"],
//       size: "M",
//       category: "unisex"
//     };

//     setItem(mockData);
//   }, []);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <span className="text-lg text-neutral-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Product Displayed */}
        <div className="flex flex-col md:flex-row gap-8 bg-white rounded-2xl shadow p-6 mb-12">
          <div className="w-full md:w-1/2 flex items-center justify-center bg-neutral-100 rounded-xl overflow-hidden min-h-[250px]">
            <img
              src={item.images[0]}
              alt={item.name}
              className="w-full h-72 object-cover rounded-xl"
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">{item.name}</h2>
              <p className="text-neutral-600 mb-4">{item.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p>
                <span className="font-semibold text-neutral-700">Condition:</span>{" "}
                <span className="capitalize">{item.condition}</span>
              </p>
              <p>
                <span className="font-semibold text-neutral-700">Size:</span> {item.size}
              </p>
              <p>
                <span className="font-semibold text-neutral-700">Cost:</span>{" "}
                <span className="text-primary-600 font-bold text-lg">{item.cost} points</span>
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
        <h3 className="text-xl font-semibold text-neutral-900 mb-4">More Images</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {item.images.slice(1).map((imgSrc, idx) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}