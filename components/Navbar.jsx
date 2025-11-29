"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Efekt pro změnu vzhledu lišty při scrollování
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Položky menu - snadná editace
  const navLinks = [
    { name: 'Domů', href: '#home' },
    { name: 'O mně', href: '#about' },
    { name: 'Kontakt', href: '#kontakt' },
  ];

  // Smooth scroll handler
  const handleSmoothScroll = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ease-in-out ${
        scrolled 
          ? 'bg-white/20 backdrop-blur-md shadow-sm py-2' 
          : 'bg-tranparent py-3'
      }`}
    >
      <div className="max-w-[1800px] max-h-[150px] mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* 1. LOGO */}
          <a href="#home" className="shrink-0 flex items-center cursor-pointer" onClick={e => handleSmoothScroll(e, '#home')}>
            <Image src="/logo.png" 
              width={150} 
              height={50} 
              alt="Logo" />
          </a>

          {/* 2. DESKTOP MENU (Skryté na mobilu) */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-stone-600 hover:text-stone-900 font-medium text-sm uppercase tracking-wide transition-colors duration-200"
                onClick={e => handleSmoothScroll(e, link.href)}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* 3. CTA TLAČÍTKO (Desktop) */}
          <div className="hidden md:flex">
            <a
              href="#kontakt"
              className="bg-stone-800 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-stone-700 transition-colors duration-200 shadow-sm"
              onClick={e => handleSmoothScroll(e, '#kontakt')}
            >
              Nezávazná poptávka
            </a>
          </div>

          {/* 4. MOBILNÍ HAMBURGER TLAČÍTKO */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-600 hover:text-stone-900 focus:outline-none p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 5. MOBILNÍ MENU (Rozbalovací část) */}
      <div className={`md:hidden absolute w-full bg-white border-b border-stone-100 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible h-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={e => handleSmoothScroll(e, link.href)}
              className="block px-3 py-3 text-base font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-md"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 mt-4 border-t border-stone-100">
             <a
              href="#kontakt"
              className="block w-full text-center bg-stone-800 text-white px-5 py-3 rounded-md text-base font-medium hover:bg-stone-700"
              onClick={e => handleSmoothScroll(e, '#kontakt')}
            >
              Nezávazná poptávka
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;