import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // ❌ TENTO ŘÁDEK TU NESMÍ BÝT AKTIVNÍ:
    // output: 'export', 
    
    images: {
        unoptimized: true, 
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/dkpyxmr2k/image/upload/**', 
            },
        ],
    },
};

export default nextConfig;
// Tady jsem přidal komentář pro vynucení aktualizace na Netlify