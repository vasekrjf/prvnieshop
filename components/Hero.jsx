import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  
  // Text pro SEO: Dlouhý, plný klíčových slov a lokality (skrytý)
  const seoH1 = "Květinářství Iveta: Ručně vázané kytice, Svatební vazby a Spolehlivý Rozvoz Květin po Praze"; 
  
  // Text pro Design: Krátký a poutavý (vizuálně zobrazený)
  const visualTitle = "Květinářství Iveta"; 
  
  // Text pro Design: Podnadpis
  const visualSubheading = "Krásné květiny pro každý okamžik"; 

  return (
    <section id="home" className="relative pt-0 h-screen flex items-center justify-center overflow-hidden">
      {/* Animované pozadí */}
      <motion.div
        className="absolute w-full h-full bg-linear-to-b from-green-300 via-green-200 to-green-50"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
      />
      
      {/* Obsah - je nad pozadím (z-10) */}
      <motion.div
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        
        {/* 1. SEO H1 TAG: VIZUÁLNĚ SKRYTÝ, ALE ČITELNÝ PRO VYHLEDÁVAČE */}
        {/* Zajišťuje, že stránka má H1 s plnými klíčovými slovy */}
        <h1 className="sr-only">
          {seoH1}
        </h1>
        
        {/* 2. VIZUÁLNÍ NADPIS (použijeme H2 pro vizuální design) */}
        {/* Tento element je velký a krásný a je viditelný pro uživatele */}
        <h2 className="text-5xl md:text-6xl font-extrabold text-green-900 mb-4">
          {visualTitle}
        </h2>
        
        {/* Podnadpis */}
        <p className="text-xl md:text-2xl text-green-800">
          {visualSubheading}
        </p>
        
        {/* CTA tlačítko */}
        <a href="#services" className="mt-8 inline-block px-6 py-3 bg-green-700 text-white font-semibold rounded-lg shadow hover:bg-green-800 transition">
          Prozkoumat nabídku
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;