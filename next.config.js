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
  // Añadir configuración de webpack para eliminar logs en producción
  webpack: (config, { isServer, dev }) => {
    // Solo aplicar en el entorno del cliente (no servidor) y en producción
    if (!isServer && !dev) {
      config.optimization.minimizer.forEach((plugin) => {
        if (plugin.constructor.name === 'TerserPlugin') {
          if (!plugin.options.terserOptions.compress) {
            plugin.options.terserOptions.compress = {};
          }
          plugin.options.terserOptions.compress.drop_console = true;
        }
      });
    }
    return config;
  },
};

module.exports = nextConfig;