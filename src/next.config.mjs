/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    excludeDefaultMomentLocales: false,
  },
  webpack: (config, { isServer }) => {
    // Exclude backup directories from build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: /windventure_backup_*/,
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.stripe.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
