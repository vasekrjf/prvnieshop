"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const formRef = useRef();
  const [status, setStatus] = useState(""); // Pro zobrazení hlášky o úspěchu/chybě

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("Odesílám...");

    emailjs
      .sendForm(
        "service_vgpfyqg",
        "template_oaj6skv",
        formRef.current,
        "jo32xM6J8evOvynT1"
      )
      .then(
        (result) => {
          console.log(result.text);
          setStatus("Zpráva byla úspěšně odeslána!");
          formRef.current.reset(); // Použijte ref pro vyčištění formuláře
        },
        (error) => {
          console.log(result.text);
          setStatus("Chyba při odesílání. Zkuste to prosím znovu.");
        }
      );
  };

  return (
    <>
      {/* Tailwind CSS neumožňuje stylovat placeholder přímo třídou v HTML elementu
        Potřebujeme k tomu blok <style>
      */}
      <style jsx global>{`
        /* Cílíme na všechny inputy a textarea v sekci #kontakt */
        #kontakt input::placeholder,
        #kontakt textarea::placeholder {
          /* Nastavujeme tmavší barvu pro placeholder, např. tmavě zelenou 700 */
          color: #15803d; /* Tailwind green-700 hex */
          opacity: 1; /* Některé prohlížeče snižují opacity, tak ji vynutíme */
        }
      `}</style>
      
      {/* 1. VNĚJŠÍ SEKCE: Bez animace, nese pouze ID a pozadí */}
      <section
        id="kontakt"
        className="py-24 px-6 md:px-20 bg-green-200 text-center"
      >
        {/* 2. VNITŘNÍ MOTION.DIV: Nese veškerý obsah a animaci */}
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            // Vnitřní obsah by měl být zarovnán na střed, což zařídí text-center
        >
            <h2 className="text-4xl font-bold mb-6 text-green-900">Kontaktujte nás</h2>
            <p className="mb-8 text-green-800 text-lg md:text-xl">
                Máte otázky? Napište nám zprávu a my se vám co nejdříve ozveme.
            </p> 	

            <form ref={formRef} onSubmit={sendEmail} className="max-w-xl mx-auto flex flex-col gap-4">
                <input
                    type="text"
                    name="user_name" 
                    placeholder="Vaše jméno"
                    required
                    // Nastavujeme barvu textu po napsání na tmavou (text-gray-800)
                    className="p-4 rounded-lg border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800"
                />
                <input
                    type="email"
                    name="user_email"
                    placeholder="Váš email"
                    required
                    // Nastavujeme barvu textu po napsání na tmavou (text-gray-800)
                    className="p-4 rounded-lg border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800"
                />
                <textarea
                    name="message"
                    placeholder="Vaše zpráva"
                    required
                    // Nastavujeme barvu textu po napsání na tmavou (text-gray-800)
                    className="p-4 rounded-lg border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800"
                    rows={5}
                ></textarea>
                
                <button type="submit" className="bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition">
                    Odeslat
                </button>

                {/* Zobrazení stavu odeslání */}
                {status && <p className="mt-4 text-green-900 font-medium">{status}</p>}
            </form>
        </motion.div>
      </section>
    </>
  );
};

export default Contact;