export const dynamic = "force-static"; // TENTO ŘÁDEK PŘIDEJTE!

import { MetadataRoute } from 'next'

const URL = 'https://ixiakvetiny.free.nf' 

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      // Hlavní stránka (Homepage)
      url: "https://ixiakvetiny.free.nf/",
      lastModified: new Date(), // Datum poslední úpravy (pro Google)
      changeFrequency: 'weekly', // Jak často se obsah mění
      priority: 1.0, // Nejdůležitější stránka
    },
  ]
}