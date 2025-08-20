// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: { optimizePackageImports: ['@sentry/nextjs'] },

  // ⚡ FORCE CSP HEADERS - MÉTHODE D'URGENCE
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' windventure.fr *.windventure.fr *.vercel.app; script-src 'self' windventure.fr *.windventure.fr *.vercel.app 'unsafe-inline' 'unsafe-eval'; style-src 'self' windventure.fr *.windventure.fr *.vercel.app 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.googleapis.com fonts.gstatic.com data:; connect-src 'self' *.sentry.io api.vercel.com vitals.vercel-insights.com; img-src 'self' data: blob: windventure.fr *.windventure.fr *.vercel.app; frame-src 'self' *.vercel.app; object-src 'none'; base-uri 'self'; form-action 'self'"
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  }
};

const sentryWebpackPluginOptions = {
  silent: true,
  widenClientFileUpload: true,
  transpileClientSDK: false,
  hideSourceMaps: true,
  disableLogger: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);