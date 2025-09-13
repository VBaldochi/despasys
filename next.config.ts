import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Otimizações de performance
  poweredByHeader: false,
  
  // Compressão
  compress: true,

  // Excluir pasta mobile do build
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Ignorar arquivos do mobile durante o build
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/mobile/**', '**/node_modules/**']
    };
    return config;
  },
  
  // Experimental features para melhor performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@headlessui/react']
  },

  // Headers de cache
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
