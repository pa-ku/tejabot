/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.forEach((rule) => {
      if (rule.test && rule.use && !Array.isArray(rule.use)) {
        console.warn(`Expected array for rule.use but got: `, rule.use)
      }
    })
    return config
  },
}

export default nextConfig
