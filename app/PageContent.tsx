"use client"; 
import React from "react";
// Importy komponent
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import Flowers from "../components/Flowers";
import Contact from "../components/Contact";
import AdminLogin from "../components/AdminLogin";
import AdminPanel from "../components/AdminPanel";
import Footer from "../components/Footer";

// --- 1. PŘIDAT IMPORTY PRO KOŠÍK ---
import { CartProvider } from "../context/CartContext";
import CartSidebar from "../components/CartSidebar";

const PageContent = () => {
  const [isAdminUrl, setIsAdminUrl] = React.useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdminUrl(window.location.search.includes("admin"));
    }
  }, []);

  // Podmíněné renderování administrace
  if (isAdminUrl) {
    return !isAdminLoggedIn ? (
      <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
    ) : (
      <AdminPanel onLogout={() => setIsAdminLoggedIn(false)} />
    );
  }

  return (
    // --- 2. OBALIT CELOU APLIKACI DO CartProvider ---
    <CartProvider>
      <div className="font-sans scroll-smooth">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Services />
          {/* Teď už Flowers uvidí CartProvider a error zmizí */}
          <Flowers />
          <Contact />
        </main>
        <Footer />
        
        {/* --- 3. PŘIDAT SIDEBAR, ABY BYL KOŠÍK VIDĚT --- */}
        <CartSidebar />
      </div>
    </CartProvider>
  );
};

export default PageContent;