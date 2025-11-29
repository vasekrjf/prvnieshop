import React from "react";
import Image from "next/image";

const Footer = () => {
    // Zástupné kontaktní údaje
    const tel = "+420 731 568 099";
    const email = "info@kvetinarstvi-iveta.cz";
    const adresa = "Solní 253, 301 00 Plzeň 3";

    // ZDE JE VLOŽEN VÁŠ iframe KÓD pro mapu
    const MAPA_EMBED_KÓD = (
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4335.637313957798!2d13.374305971141563!3d49.748719042972944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470af1fa977e5009%3A0xd0bb3b87e3cac70f!2zS3bEm3RpbsOhxZlzdHbDrSBJdmV0YSAtIGt2xJt0aW55IHUgUG_FoXR5!5e0!3m2!1scs!2scz!4v1764415406045!5m2!1scs!2scz" // Váš iframe kód
            width="100%"
            height="250" // ZVĚTŠENÍ VÝŠKY
            style={{ border: 0, borderRadius: '8px' }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa Květinářství Iveta"
        ></iframe>
    );

    return (
        <footer className="bg-stone-50 border-t border-stone-200 text-stone-700">
            {/* HLAVNÍ SEKCE S TŘEMI SLOUPCI */}
            <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

                {/* SLOUPEC 1: KONTAKTY */}
                <div className="flex flex-col space-y-3">
                    <h3 className="font-semibold text-lg text-stone-800 mb-2 border-b border-rose-300 pb-1 w-max">Kontaktujte nás</h3>
                    
                    <a href={`tel:${tel.replace(/\s/g, '')}`} className="hover:text-rose-600 transition duration-300 flex items-center">
                        <Image src="/phone-icon.png" 
                            alt="ikona telefonu"
                            width={24}
                            height={24}
                            className="mr-2">
                        </Image>
                        {tel}
                    </a>
                    
                    <a href={`mailto:${email}`} className="hover:text-rose-600 transition duration-300 flex items-center">
                        <Image src="/mail-icon.png" 
                            alt="ikona mailu"
                            width={24}
                            height={24}
                            className="mr-2">
                        </Image>
                        {email}
                    </a>

                    <p className="pt-2 text-sm">{adresa}</p>
                </div>

                {/* SLOUPEC 2: MAPA */}
                <div className="md:col-span-1">
                    <h3 className="font-semibold text-lg text-stone-800 mb-2 border-b border-rose-300 pb-1 w-max">Kde nás najdete</h3>
                    <div className="pb-4"> {/* ZVÝŠENÉ ODSÁZENÍ POD MAPOU */}
                        {MAPA_EMBED_KÓD}
                    </div>
                </div>
                
                {/* SLOUPEC 3: INFO */}
                <div className="flex flex-col space-y-3 md:text-left">
                    <h3 className="font-semibold text-lg text-stone-800 mb-2 border-b border-rose-300 pb-1 w-max">O Květinářství Iveta</h3>
                    <p className="text-sm">
                        Jsme rodinné květinářství s dlouholetou tradicí. Vytváříme jedinečné kytice pro každou příležitost.
                    </p>
                </div>

            </div>

            {/* COPYRIGHT SEKCE POD VŠEMI SLOUPCI */}
            <div className="border-t border-stone-200 py-4">
                <p className="text-center text-sm text-stone-500">
                    © 2025 Květinářství Iveta. Všechna práva vyhrazena.
                </p>
            </div>
        </footer>
    );
}

export default Footer;