import React from "react";
import type { Metadata } from 'next'; 
import PageContent from "./PageContent"; 

// =================================================================
// METADATA (Zůstává beze změny, je správně)
// =================================================================
export const metadata: Metadata = {
  title: 'Květinářství Iveta | Kytice, Svatební vazby a Rozvoz květin', // Unikátní, SEO-optimalizovaný titul
  description: 'Vstupte do světa Květinářství Iveta! Objevte denně čerstvé, ručně vázané kytice, luxusní svatební vazby a dokonalé firemní dekorace.',
  alternates: { canonical: 'https://ixiakvetiny.free.nf/', }, // Unikátní adresa
};

// =================================================================
// HLAVNÍ KOMPONENTA S LOCALBUSINESS SCHEMA
// =================================================================
export default function Page() {
    
    // Zde je JSON-LD kód pro LocalBusiness
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "Florist, Flowershop, Květinářství",
      "name": "Květinářství Iveta",
      "image": "https://ixiakvetiny.free.nf/logo.png", // Plná URL k logu
      "url": "https://ixiakvetiny.free.nf",
      "telephone": "+420 731 568 099", // ZDE VYPLŇTE SKUTEČNÉ ČÍSLO
      "priceRange": "$$", // Použijte $, $$, $$$ pro cenovou hladinu
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Solní 253", // ZDE VYPLŇTE ADRESU
        "addressLocality": "Plzeň, Pilsen", // ZDE VYPLŇTE MĚSTO
        "postalCode": "301 00", // ZDE VYPLŇTE PSČ
        "addressCountry": "CZ"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "07:00",
          "closes": "18:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Saturday"],
          "opens": "08:00",
          "closes": "12:00"
        }
      
      ]
    };
    
    return (
        <>
            {/* Vložení Schema Markup do hlavičky dokumentu */}
            <script 
                type="application/ld+json" 
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} 
            />
            
            <PageContent /> 
        </>
    );
}