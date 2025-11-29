"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Flower, CartItem } from "../app/types"; // Ujisti se, že cesta sedí k souboru z kroku 1

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Flower) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, amount: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 1. Načtení košíku z LocalStorage (běží jen jednou po startu)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("flowerShopCart");
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error("Chyba při načítání košíku:", error);
        }
      }
    }
  }, []);

  // 2. Uložení košíku do LocalStorage (běží při každé změně košíku)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("flowerShopCart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Přidat do košíku
  const addToCart = (product: Flower) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        // Pokud už tam je, jen zvýšíme počet
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Pokud tam není, přidáme ho s quantity 1
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // Otevřít košík po přidání
  };

  // Odebrat z košíku úplně
  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Změnit množství (+/-)
  const updateQuantity = (id: string, amount: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + amount;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      })
    );
  };

  // Vyčistit košík (např. po nákupu)
  const clearCart = () => {
    setCartItems([]);
  };

  // Výpočty
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart musí být použit uvnitř CartProvider");
  }
  return context;
};