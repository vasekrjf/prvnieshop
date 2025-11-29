import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const About = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-stone-50 overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          {/* 1. OBRÁZEK (Levá strana) */}
          <motion.div 
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* Ozdobný rámeček pod fotkou */}
              <div className="absolute top-4 left-4 w-full h-full border-2 border-green-800/20 rounded-lg z-0"></div>
              
              {/* Samotná fotka */}
              <Image 
                src="/obchod.jpeg"
                alt="Interiér našeho květinářství" 
                className="relative z-10 w-full h-[400px] lg:h-[600px] object-cover rounded-lg shadow-md"
                width={800} 
                height={600}
              />
            </div>
          </motion.div>

          {/* 2. TEXT (Pravá strana) */}
          <motion.div 
            className="w-full md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-green-800 font-bold uppercase tracking-widest text-sm mb-4">
              Náš příběh
            </h2>
            <h2 className="text-3xl md:text-5xl font-serif font-medium text-stone-900 mb-6 leading-tight">
              Více než jen <br/> květinářství
            </h2>
            <div className="space-y-6 text-stone-600 text-lg leading-relaxed">
              <p>
                Vítejte v našem malém zeleném království. Jsme rodinné květinářství, které věří, že květiny nejsou jen dárek, ale způsob, jak vyjádřit emoce, když slova nestačí.
              </p>
              <p>
                Každé ráno pro vás osobně vybíráme ty nejčerstvější květy na burze. Milujeme přirozenost, vůni čerstvého eukalyptu a radost v očích, když si odnášíte svou vazbu.
              </p>
              <p>
                Ať už potřebujete velkolepý pugét k výročí, nebo jen malou kytičku do vázy na nedělní stůl, u nás jste vždy vítáni.
              </p>
            </div>

            {/* Podpis nebo citát */}
            <div className="mt-10 pt-6 border-t border-stone-200 inline-block">
              <p className="font-serif italic text-2xl text-stone-800">
                "S láskou k přírodě."
              </p>
              <p className="text-sm text-stone-500 mt-2 uppercase tracking-wide">
                — Tým Květinářství Iveta
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;