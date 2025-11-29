"use client";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useCart } from "../../context/CartContext"; // Zkontroluj počet teček (../..) podle struktury
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

// Oddělená komponenta pro logiku (Next.js to vyžaduje kvůli Suspense)
function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    if (!sessionId) return;

    // Funkce pro uložení objednávky
    const saveOrder = async () => {
      try {
        // Voláme tvůj backend api/verify-order
        const res = await fetch("/api/verify-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        
        const data = await res.json();
        
        if (res.ok) {
          setStatus("success");
          clearCart(); // Vymažeme košík, protože je objednáno
        } else {
          console.error("Chyba při ukládání:", data.error);
          setStatus("error");
        }
      } catch (err) {
        console.error("Chyba sítě:", err);
        setStatus("error");
      }
    };

    // Spustíme to hned, jak se stránka načte
    saveOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (status === "loading") {
    return <p className="text-xl text-stone-600 animate-pulse">Ověřuji platbu a ukládám objednávku...</p>;
  }

  if (status === "error") {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Něco se pokazilo</h1>
        <p className="text-stone-600 mb-6">Platba možná proběhla, ale nepodařilo se ji uložit do systému.<br/>Prosím, kontaktujte nás a opište si ID: {sessionId}</p>
        <Link href="/contact" className="text-stone-900 underline">Kontaktovat podporu</Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 className="text-3xl font-bold text-stone-900 mb-4">Objednávka přijata!</h1>
      <p className="text-stone-600 mb-8 text-lg">
        Děkujeme. Platba proběhla úspěšně.<br/>
        Květiny pro vás připravíme k vyzvednutí na prodejně.
      </p>

      <Link 
        href="/" 
        className="inline-block bg-stone-900 text-white px-8 py-3 rounded-full font-medium hover:bg-stone-800 transition-colors"
      >
        Zpět do obchodu
      </Link>
    </motion.div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-4 text-center">
      <Suspense fallback={<p>Načítání...</p>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}