/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.forEach((rule) => {
        if (rule.use) {
          rule.use.forEach((u) => {
            if (u.loader && u.loader.includes('source-map-loader')) {
              u.exclude = /node_modules/
            }
          })
        }
      })
    }
    return config
  },
}

export default nextConfig
