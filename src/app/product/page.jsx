"use client";

import "./product.css";
import { useEffect, useState } from "react";

export default function Productpage() {
  const [item, setItem] = useState(null);

  useEffect(() => {
    const mockData = {
      name: "Vintage Denim Jacket",
      description: "A classic blue denim jacket with a comfortable fit and timeless style.",
      cost: 150,
      images: [
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRhffebP9pO--l9cvo_LDqt6J_xvCpxgRQso8Uk3nU3NOQrAkx3gUt8f-pUv0ncS3YOkitGSjH6isuvkDot_WIELJtnNZ8AVU49bmVil78dq9JIr6o6PPiO", // main
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQ6Mhmntq1fzSN6NKxJdUr36urdI5bR2tui_3u1xXWGNx2ppZPKuUGWxjFZJM2c5m59YlJO0vpAH4tMpB-kYCCk9HbB2XCXJKyi8lMoJw2Z", // alt 1
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRzAobCUVIGW4oIzLCLIxF4oFr-aYN3kLKS-AAP2lbhy7BkZ4nuEVGxvIQFutxeSQuWw0GrdWt1NxGvnv5faFFAW0OQJe7SZ-T1qHVLKsk", // alt 2
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR8umqN-BlQM6XKXEMy15b8ekNRV2XsauFgTnDXV6scRztW8D7tDNc8pQHSOwpsR-KsNH7lOhf0Fofwr1_IP_bC4iV9KNdayQd6TXxR-TXmT_bdqLRJh4twMw", // alt 3
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTx3pUlKjequDrH3jCyN4jgnFAnaCNX8IMjozFzmPaHTEwbPexSFIIycZiCIMfNA4hfUl-f4TvaOrPzmbfflaexep2uJhNEi0zfOfY-BM3kbLcgY2gsnBrH"   // alt 4
      ],
      condition: "excellent",
      tags: ["jacket", "coat"],
      size: "M",
      category: "unisex"
    };

    setItem(mockData);
  }, []);

  if (!item) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      {/* Product Displayed */}
      <div className="displayed-section">
        <div className="displayed-product">
          {/* Main Product Image */}
          <img src={item.images[0]} alt="Main Product" />
        </div>
        <div className="displayed-info">
          <h2>{item.name}</h2>
          <p>{item.description}</p>
          <p><strong>Condition:</strong> {item.condition}</p>
          <p><strong>Size:</strong> {item.size}</p>
          <p><strong>Cost:</strong> ₹{item.cost}</p>
        </div>
      </div>

      {/* Alternate Images */}
      <h3 className="subtitle">More Images</h3>
      <div className="item-grid">
        {/*
          We use slice(1) to skip the first image (which is the main product image).
          The 'key' prop is important for React to efficiently render list items.
          The 'alt' attribute provides accessibility.
        */}
        {item.images.slice(1).map((imgSrc, index) => (
          <div key={index} className="item-card">
            <img src={imgSrc} alt={`Alt ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}