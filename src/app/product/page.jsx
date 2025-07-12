// app/your-page-name/page.jsx

// (Optional) If you need client-side interactivity like useState, useEffect, or event handlers
// uncomment the line below. If it's a static page or only fetches data on the server, keep it commented.
// "use client";

import Head from 'next/head'; // For managing document head (title, meta tags)
import Productpage from './product-page';
// You can fetch data directly in a Server Component (default for pages in app router)
// or use client-side fetching within a "use client" component.

// Example of data fetching in a Server Component:
async function getData() {
  // Simulate a delay for fetching data
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    title: "My Awesome Next.js Page",
    content: "Welcome to my Next.js template page!",
    items: ["Item 1", "Item 2", "Item 3"]
  };
}

    const mockData = {
      name: "Vintage Denim Jacket",
      description: "A classic blue denim jacket with a comfortable fit and timeless style.",
      cost: 150,
      images: [
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRhffebP9pO--l9cvo_LDqt6J_xvCpxgRQso8Uk3nU3NOQrAkx3gUt8f-pUv0ncS3YOkitGSjH6isuvkDot_WIELJtnNZ8AVU49bmVil78dq9JIr6o6PPiO",
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQ6Mhmntq1fzSN6NKxJdUr36urdI5bR2tui_3u1xXWGNx2ppZPKuUGWxjFZJM2c5m59YlJO0vpAH4tMpB-kYCCk9HbB2XCXJKyi8lMoJw2Z",
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRzAobCUVIGW4oIzLCLIxF4oFr-aYN3kLKS-AAP2lbhy7BkZ4nuEVGxvIQFutxeSQuWw0GrdWt1NxGvnv5faFFAW0OQJe7SZ-T1qHVLKsk",
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR8umqN-BlQM6XKXEMy15b8ekNRV2XsauFgTnDXV6scRztW8D7tDNc8pQHSOwpsR-KsNH7lOhf0Fofwr1_IP_bC4iV9KNdayQd6TXxR-TXmT_bdqLRJh4twMw",
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTx3pUlKjequDrH3jCyN4jgnFAnaCNX8IMjozFzmPaHTEwbPexSFIIycZiCIMfNA4hfUl-f4TvaOrPzmbfflaexep2uJhNEi0zfOfY-BM3kbLcgY2gsnBrH"
      ],
      condition: "excellent",
      tags: ["jacket", "coat"],
      size: "M",
      category: "unisex"
    };

export default async function YourPageName() {
  const data = await getData(); // Data fetched on the server

  return (
    // The outermost div often acts as the main layout container
    <div className="container mx-auto p-4">
      <Productpage item={mockData}/>
      {/* Head component for SEO and browser tab title */}
      <Head>
        <title>{data.title}</title>
        <meta name="description" content="A template for a Next.js page." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Main content of the page */}
      <main className="my-8">
        <h1 className="text-4xl font-bold text-center mb-6">
          {data.title}
        </h1>

        <p className="text-lg text-gray-700 text-center mb-8">
          {data.content}
        </p>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Featured Items:</h2>
          <ul className="list-disc list-inside space-y-2">
            {data.items.map((item, index) => (
              <li key={index} className="text-gray-800">
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Example of a button that could trigger client-side logic if "use client" is enabled */}
        {/*
        <div className="text-center mt-8">
          <button
            onClick={() => alert('Button clicked!')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Click Me (Client-Side)
          </button>
        </div>
        */}
      </main>

      {/* Optional: Footer section */}
      <footer className="text-center mt-12 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
}