module.exports = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.module.rules.push({
          test: /\.js\.map$/,
          use: 'ignore-loader'
        });
      }
      return config;
    }
  }