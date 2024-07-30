module.exports = {
    webpack: (config, { isServer }) => {
      config.module.rules.push({
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      });
  
      return config;
    },
  }