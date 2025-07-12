import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Provider from "@/contexts/Provider";

const geistMono = Geist_Mono({
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Odoo ReWear",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-background text-primary">
      <body className={`${inter.className} ${geistMono.className}`}>
        {children}
      </body>
    </html>
  );
}
