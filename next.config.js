// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Ignorar errores de ESLint durante la construcción
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorar errores de TypeScript durante la construcción
    ignoreBuildErrors: true,
  },
  async rewrites() {
    console.log('Configurando rewrites para proxy API');
    return [
      {
        source: '/api/:path*',
        destination: 'http://82.165.142.177:8083/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;