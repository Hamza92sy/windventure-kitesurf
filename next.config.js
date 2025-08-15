// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable source maps in production for better error tracking
  productionBrowserSourceMaps: true,
  
  // Skip ESLint during build for faster deployment  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Skip TypeScript during build for faster deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['@sentry/nextjs'],
  },

  // Optional redirects (commented out - packages page exists)
  // Uncomment the redirects below if you want to redirect /packages to another page
  /*
  async redirects() {
    return [
      {
        source: '/packages',
        destination: '/pricing', // or '/book', '/offers', etc.
        permanent: true,         // 301 redirect
      },
    ];
  },
  */
  
  // Enhanced security headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'accelerometer=(), camera=(), geolocation=(), microphone=(), payment=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:", // Sentry/Vercel compatible
              "style-src 'self' 'unsafe-inline' https:",
              "img-src * data: blob:",
              "font-src 'self' data: https:",
              "connect-src * wss: ws:",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ]
  },
};

// Sentry configuration
const sentryWebpackPluginOptions = {
  // Suppresses source map uploading logs during build
  silent: true,
  
  // Upload source maps to Sentry
  widenClientFileUpload: true,
  
  // Transpiles SDK to be compatible with IE11
  transpileClientSDK: false,
  
  // Hides source maps from generated client bundles
  hideSourceMaps: true,
  
  // Automatically tree-shake Sentry logger statements
  disableLogger: true,
  
  // Sentry organization and project
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
