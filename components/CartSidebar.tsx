"use client";
import React, { useState } from "react"; // PŘIDÁNO useState
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import Image from "next/image";

const CartSidebar = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    cartTotal, 
    isCartOpen, 
    setIsCartOpen 
  } = useCart();

  // Stav pro načítání (aby uživatel neklikal 2x)
  const [isLoading, setIsLoading] = useState(false);

  // --- TOTO JE TA DŮLEŽITÁ ZMĚNA ---
  const handleCheckout = async () => {
    setIsLoading(true); // Zapneme točící se kolečko

    try {
      // 1. Pošleme data na tvůj backend (route.ts)
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cartItems }),
      });

      const data = await response.json();

      // 2. Pokud backend vrátil URL, přesměrujeme tam uživatele
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Pokud nastala chyba na backendu
        console.error("Chyba z backendu:", data.error);
        alert("Chyba: " + (data.error || "Nepodařilo se vytvořit platbu."));
        setIsLoading(false);
      }
    } catch (error) {
      // Pokud selhala síť nebo fetch
      console.error("Chyba sítě:", error);
      alert("Nepodařilo se spojit se serverem. Zkontroluj konzoli.");
      setIsLoading(false);
    }
  };
  // ---------------------------------

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-[9998] backdrop-blur-sm cursor-pointer"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[9999] shadow-2xl flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b border-stone-100">
              <h2 className="text-2xl font-bold text-stone-800 font-serif">Váš košík</h2>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-stone-400">
                  <p className="text-lg">Váš košík je prázdný.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 text-stone-800 underline hover:no-underline"
                  >
                    Pokračovat v nákupu
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-24 relative bg-stone-50 rounded-lg overflow-hidden flex-shrink-0 border border-stone-100">
                      <Image 
                        src={item.img || item.imageUrl || "/placeholder.jpg"} 
                        alt={item.name} 
                        fill 
                        className="object-cover" 
                        sizes="96px"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-stone-900 text-lg leading-tight">{item.name}</h4>
                          <p className="font-medium text-stone-900 ml-2">{item.price * item.quantity} Kč</p>
                        </div>
                        <p className="text-stone-500 text-sm mt-1">{item.price} Kč / ks</p>
                      </div>
                      
                      <div className="flex justify-between items-end mt-2">
                        <div className="flex items-center border border-stone-200 rounded-md">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)} 
                            className="px-3 py-1 hover:bg-stone-50 text-stone-600 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-2 text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)} 
                            className="px-3 py-1 hover:bg-stone-50 text-stone-600 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          className="text-xs text-red-500 hover:text-red-700 underline decoration-red-200 underline-offset-2 transition-colors"
                        >
                          Odebrat
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-stone-100 bg-stone-50/50">
              <div className="flex justify-between mb-2 text-stone-600">
                <span>Mezisoučet</span>
                <span>{cartTotal} Kč</span>
              </div>
              <div className="flex justify-between mb-6 text-xl font-bold text-stone-900">
                <span>Celkem</span>
                <span>{cartTotal} Kč</span>
              </div>
              
              <div className="bg-stone-100 p-3 rounded mb-4 text-xs text-stone-600 flex gap-2">
                <span>
                  <strong>Osobní odběr na prodejně.</strong> <br/>
                  Platba proběhne online kartou (Stripe).
                </span>
              </div>

              {/* Tlačítko nyní reaguje na isLoading */}
              <button 
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || isLoading}
                className="w-full bg-stone-900 text-white py-4 rounded-lg font-medium text-lg hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.99] flex justify-center items-center"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Přejít k platbě"
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;