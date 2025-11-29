import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. PŘIDAT TENTO IMPORT
import { CartProvider } from "../context/CartContext"; // Zkontroluj cestu (možná ./context/...)

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Květinářství",
  description: "E-shop s květinami",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body className={inter.className}>
        {/* 2. OBALIT VŠE DO CartProvider */}
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}