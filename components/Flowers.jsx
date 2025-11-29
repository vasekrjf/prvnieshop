"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Image from "next/image";
// IMPORTUJEME HOOK PRO KOŠÍK
import { useCart } from "../context/CartContext"; 

const staticCollections = [];

const Flowers = () => {
  const [collections, setCollections] = useState(staticCollections);
  const { addToCart } = useCart(); // Vytáhneme si funkci addToCart

  useEffect(() => {
    const unsubSections = onSnapshot(collection(db, "sections"), (sectionsSnap) => {
      const sectionsArr = [];
      sectionsSnap.forEach((doc) => {
        sectionsArr.push({ id: doc.id, ...doc.data() });
      });
      
      onSnapshot(collection(db, "flowers"), (flowersSnap) => {
        const flowersArr = [];
        flowersSnap.forEach((doc) => {
          flowersArr.push({ id: doc.id, ...doc.data() });
        });
       
        const dynamicCollections = sectionsArr.map((section) => ({
          title: section.name,
          items: flowersArr.filter((flower) => flower.section === section.name)
        }));
        setCollections(dynamicCollections.length > 0 ? dynamicCollections : staticCollections);
      });
    });
    return () => unsubSections();
  }, []);

  return (
    <section className="py-16 px-4 md:px-8 lg:px-20 bg-white">
      {collections.map((collection, sectionIndex) => (
        <div key={sectionIndex} className="mb-24 last:mb-0">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-stone-800 tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {collection.title}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {collection.items.map((item, itemIndex) => (
              <motion.div
                key={item.id}
                className="flex flex-col h-full text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: itemIndex * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="relative mb-6 overflow-hidden">
                  <Image
                    src={item.img || item.imageUrl}
                    alt={item.name}
                    width={400}
                    height={400}
                    className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* TLAČÍTKO PRO RYCHLÉ PŘIDÁNÍ PŘES OBRÁZEK (VOLITELNÉ) */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button 
                        onClick={() => addToCart(item)}
                        className="bg-white text-stone-900 px-6 py-2 rounded-full font-medium hover:bg-stone-100 transform translate-y-4 group-hover:translate-y-0 transition-all"
                     >
                        Přidat do košíku
                     </button>
                  </div>
                </div>
                <div className="flex flex-col grow px-2">
                  <h3 className="text-lg font-medium text-stone-900 mb-2 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-stone-800 font-semibold mb-1 text-lg">
                    {item.price} Kč
                  </p>
                  <p className="text-stone-500 text-sm mb-4">
                    {item.subtitle}
                  </p>
                  
                  {/* HLAVNÍ TLAČÍTKO KOŠÍKU */}
                  <button
                    onClick={() => addToCart(item)}
                    className="mt-auto border border-stone-300 text-stone-600 px-4 py-2 rounded hover:bg-stone-900 hover:text-white transition-colors text-sm uppercase tracking-wider"
                  >
                    Do košíku
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Flowers;