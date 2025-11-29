import React from "react";
import Image from "next/image";


function Services() {
  const services = [
    {
      id: 1,
      name: "Malá kytice",
      price: "999 Kč",
      image: "/malakytice.webp",
      description: "Jemná a elegantní volba pro drobné potěšení. Malá kytice je ideální jako milá pozornost, poděkování nebo drobný dárek, který potěší každou příležitost.",
    },
    {
      id: 2,
      name: "Střední kytice",
      price: "1 999 Kč",
      image: "/strednikytice.webp",
      description: "Vyvážená a univerzální kytice, která zaujme bohatším vzhledem, ale stále působí přirozeně. Skvělá volba k narozeninám, svátku nebo jako dekorace do interiéru..",
    },
    {
      id: 3,
      name: "Velká kytice",
      price: "4 999 Kč",
      image: "/velkakytice.jpeg",
      description: "Luxusní, výrazná a okázalá kytice plná květů. Perfektní, když chcete udělat skutečně silný dojem – například k výročí, významným oslavám či jako výjimečné gesto lásky.",
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Služby a ceny</h2>
          <p className="text-gray-600 text-lg">Vyber si balíček, který nejlépe vyhovuje tvým potřebám</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:scale-105"
            >
              {/* Obrázek */}
              <Image
                src={service.image}
                width={250}
                height={250}
                alt={service.name}
                className="w-full h-48 object-cover"
                loading="lazy"
              />

              {/* Obsah */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {service.name}
                </h3>
                <p className="text-green-600 text-3xl font-bold mb-4">
                  {service.price}
                </p>
                <p className="text-gray-600 mb-4">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
