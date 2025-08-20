#!/usr/bin/env node

/**
 * 🚨 Script d'urgence pour forcer les headers CSP
 * Si le middleware ne fonctionne pas, on utilise cette approche
 */

const fs = require('fs');
const path = require('path');

class CSPHeadersForcer {
  constructor() {
    this.methods = [];
  }

  async run() {
    console.log('🚨 FORCE CSP HEADERS - Méthodes d\'urgence');
    console.log('═'.repeat(50));
    
    await this.method1_NextConfig();
    await this.method2_VercelConfig();
    await this.method3_MiddlewareSimple();
    
    this.displayResults();
  }

  async method1_NextConfig() {
    console.log('\n📝 1. Méthode Next.config.js (overwrite)...');
    
    const nextConfigContent = `// eslint-disable-next-line @typescript-eslint/no-var-requires
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

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);`;

    // Sauvegarder l'ancien fichier
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    if (fs.existsSync(nextConfigPath)) {
      const backup = fs.readFileSync(nextConfigPath, 'utf8');
      fs.writeFileSync(`${nextConfigPath}.backup`, backup);
    }
    
    fs.writeFileSync(nextConfigPath, nextConfigContent);
    this.methods.push('✅ next.config.js overwritten with CSP headers');
    console.log('   ✅ next.config.js mis à jour avec CSP forcé');
  }

  async method2_VercelConfig() {
    console.log('\n📝 2. Méthode vercel.json (renforcée)...');
    
    const vercelConfig = {
      "headers": [
        {
          "source": "/(.*)",
          "headers": [
            {
              "key": "Content-Security-Policy",
              "value": "default-src 'self' windventure.fr *.windventure.fr *.vercel.app; script-src 'self' windventure.fr *.windventure.fr *.vercel.app 'unsafe-inline' 'unsafe-eval'; style-src 'self' windventure.fr *.windventure.fr *.vercel.app 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.googleapis.com fonts.gstatic.com data:; connect-src 'self' *.sentry.io api.vercel.com vitals.vercel-insights.com; img-src 'self' data: blob: windventure.fr *.windventure.fr *.vercel.app; frame-src 'self' *.vercel.app; object-src 'none'; base-uri 'self'; form-action 'self'"
            },
            {
              "key": "X-Frame-Options",
              "value": "DENY"
            },
            {
              "key": "X-Content-Type-Options", 
              "value": "nosniff"
            },
            {
              "key": "Referrer-Policy",
              "value": "strict-origin-when-cross-origin"
            },
            {
              "key": "X-CSP-Force",
              "value": "windventure-emergency-fix"
            }
          ]
        }
      ],
      "functions": {
        "app/api/**": {
          "maxDuration": 30
        }
      }
    };
    
    fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
    this.methods.push('✅ vercel.json renforcé avec header X-CSP-Force');
    console.log('   ✅ vercel.json renforcé');
  }

  async method3_MiddlewareSimple() {
    console.log('\n📝 3. Middleware ultra-simple...');
    
    const simpleMiddleware = `import { NextResponse } from 'next/server'

export function middleware() {
  const response = NextResponse.next()
  
  response.headers.set('Content-Security-Policy', "default-src 'self' windventure.fr *.windventure.fr *.vercel.app; script-src 'self' windventure.fr *.windventure.fr *.vercel.app 'unsafe-inline' 'unsafe-eval'; style-src 'self' windventure.fr *.windventure.fr *.vercel.app 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.googleapis.com fonts.gstatic.com data:; connect-src 'self' *.sentry.io api.vercel.com vitals.vercel-insights.com; img-src 'self' data: blob: windventure.fr *.windventure.fr *.vercel.app; frame-src 'self' *.vercel.app; object-src 'none'; base-uri 'self'; form-action 'self'")
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Middleware-Force', 'active')
  
  return response
}

export const config = {
  matcher: '/:path*'
}`;
    
    fs.writeFileSync('middleware.ts', simpleMiddleware);
    this.methods.push('✅ middleware.ts simplifié au maximum');
    console.log('   ✅ middleware.ts simplifié');
  }

  displayResults() {
    console.log('\n' + '═'.repeat(50));
    console.log('🚨 MÉTHODES D\'URGENCE APPLIQUÉES');
    console.log('═'.repeat(50));
    
    this.methods.forEach(method => {
      console.log(`   ${method}`);
    });
    
    console.log('\n⚡ ACTIONS IMMÉDIATES:');
    console.log('   1. npm run build');
    console.log('   2. git add . && git commit -m "🚨 Force CSP headers"');
    console.log('   3. git push origin main');
    console.log('   4. Attendre 2min puis: npm run debug:csp');
    
    console.log('\n🔍 VÉRIFICATION:');
    console.log('   curl -s -D - https://windventure.fr -o /dev/null | grep -i "csp\\|x-frame\\|x-middleware"');
    
    console.log('\n⚠️ ROLLBACK SI NÉCESSAIRE:');
    console.log('   mv next.config.js.backup next.config.js');
    
    console.log('═'.repeat(50));
  }
}

if (require.main === module) {
  const forcer = new CSPHeadersForcer();
  forcer.run().catch(console.error);
}

module.exports = CSPHeadersForcer;