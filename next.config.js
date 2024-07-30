module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        module: false,
        child_process: false,  // Importante para Puppeteer
      };
    }
    // Habilitar source maps
    config.module.rules.push({
      test: /\.js\.map$/,
      use: ['source-map-loader'],
      enforce: 'pre'
    });

    // Soporte para TypeScript si no está ya configurado
    config.module.rules.push({
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    });

    return config;
  },
};
