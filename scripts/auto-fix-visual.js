import React from 'react';
#!/usr/bin/env node

/**
 * 🔧 Auto-Fix Visuel pour Windventure.fr
 * Corrige automatiquement les problèmes visuels détectés
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class VisualAutoFixer {
  constructor() {
    this.fixes = [];
    this.reportPath = 'visual-debug-report.json';
    this.backupCreated = false;
  }

  async run() {
        
    // Charger le rapport de diagnostic
    if (!fs.existsSync(this.reportPath)) {
            process.exit(1);
    }
    
    const report = JSON.parse(fs.readFileSync(this.reportPath, 'utf8'));
        
    // Créer une sauvegarde
    this.createBackup();
    
    // Appliquer les corrections par type
    await this.fixMissingAssets(report.issues);
    await this.fixTailwindConfig(report.issues);
    await this.fixResponsiveIssues(report.issues);
    await this.fixImageIssues(report.issues);
    await this.fixLayoutOverflow(report.issues);
    await this.optimizePerformance(report.metrics);
    
    this.generateFixReport();
  }
  
  createBackup() {
    if (this.backupCreated) return;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = `backup-${timestamp}`;
    
        
    try {
      execSync(`cp -r src ${backupDir}-src`);
      execSync(`cp -r public ${backupDir}-public`);
      execSync(`cp tailwind.config.js ${backupDir}-tailwind.config.js 2>/dev/null || true`);
      execSync(`cp next.config.js ${backupDir}-next.config.js 2>/dev/null || true`);
      
      this.fixes.push('Sauvegarde créée');
      this.backupCreated = true;
    } catch (error) {
      console.warn('⚠️ Impossible de créer la sauvegarde:', error.message);
    }
  }
  
  async fixMissingAssets(issues) {
    const missingAssets = issues.filter(i => i.type === 'missing_asset');
    if (missingAssets.length === 0) return;
    
        
    missingAssets.forEach(asset => {
      if (asset.resourceType === 'stylesheet') {
        this.fixMissingStylesheet(asset);
      } else if (asset.resourceType === 'script') {
        this.fixMissingScript(asset);
      } else if (asset.resourceType === 'image') {
        this.fixMissingImage(asset);
      }
    });
  }
  
  fixMissingStylesheet(asset) {
    // Vérifier si c'est un problème de Tailwind CSS
    if (asset.url.includes('tailwind') || asset.url.includes('styles')) {
            
      // Reconstruire les styles
      try {
        execSync('npm run build', { stdio: 'pipe' });
        this.fixes.push('Tailwind CSS reconstruit');
      } catch (error) {
        console.warn('   ⚠️ Échec de la reconstruction:', error.message);
      }
    }
  }
  
  fixMissingScript(asset) {
        
    // Vérifier si c'est un script Next.js
    if (asset.url.includes('_next/static')) {
      try {
        execSync('rm -rf .next && npm run build', { stdio: 'pipe' });
        this.fixes.push('Build Next.js régénéré');
      } catch (error) {
        console.warn('   ⚠️ Échec de la régénération:', error.message);
      }
    }
  }
  
  fixMissingImage(asset) {
        
    // Créer une image placeholder si nécessaire
    const imagePath = asset.url.replace(/^https?:\/\/[^\/]+/, './public');
    const dir = path.dirname(imagePath);
    
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
        // Créer un placeholder SVG
        const placeholder = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f3f4f6"/>
          <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6b7280">Image manquante</text>
        </svg>`;
        fs.writeFileSync(imagePath.replace(/\\.(jpg|jpeg|png|gif)$/, '.svg'), placeholder);
        this.fixes.push(`Placeholder créé pour ${path.basename(imagePath)}`);
      } catch (error) {
        console.warn('   ⚠️ Impossible de créer le placeholder:', error.message);
      }
    }
  }
  
  async fixTailwindConfig(issues) {
    const tailwindIssues = issues.filter(i => i.type === 'css_framework');
    if (tailwindIssues.length === 0) return;
    
        
    const tailwindConfigPath = 'tailwind.config.js';
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(tailwindConfigPath)) {
            
      const config = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}`;
      
      fs.writeFileSync(tailwindConfigPath, config);
      this.fixes.push('Configuration Tailwind créée');
    }
    
    // Vérifier globals.css
    const globalsPath = 'src/app/globals.css';
    if (fs.existsSync(globalsPath)) {
      const content = fs.readFileSync(globalsPath, 'utf8');
      
      if (!content.includes('@tailwind')) {
                
        const tailwindDirectives = `@tailwind base;
@tailwind components;
@tailwind utilities;

`;
        
        fs.writeFileSync(globalsPath, tailwindDirectives + content);
        this.fixes.push('Directives Tailwind ajoutées');
      }
    }
  }
  
  async fixResponsiveIssues(issues) {
    const responsiveIssues = issues.filter(i => i.type === 'responsive_issue');
    if (responsiveIssues.length === 0) return;
    
        
    // Générer un CSS de correction
    let fixCSS = `
/* Auto-generated responsive fixes */
* {
  box-sizing: border-box;
}

img {
  max-width: 100%;
  height: auto;
}

.container {
  max-width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Prevent horizontal overflow */
body {
  overflow-x: hidden;
}

/* Fix common responsive issues */
@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }
  
  .mobile-stack > * {
    width: 100% !important;
    margin-bottom: 1rem;
  }
}
`;
    
    const fixPath = 'src/styles/auto-fixes.css';
    fs.writeFileSync(fixPath, fixCSS);
    this.fixes.push('CSS responsive généré');
    
          }
  
  async fixImageIssues(issues) {
    const imageIssues = issues.filter(i => i.type === 'broken_image');
    if (imageIssues.length === 0) return;
    
        
    // Générer un composant d'image optimisé
    const imageComponentPath = 'src/components/OptimizedImage.tsx';
    const imageComponent = `import { useState } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  fallback = '/images/placeholder.svg'
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={\\`relative overflow-hidden \\${className}\\`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-400">Chargement...</span>
        </div>
      )}
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={\\`transition-opacity duration-300 \\${isLoading ? 'opacity-0' : 'opacity-100'}\\`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallback);
          setIsLoading(false);
        }}
        priority={false}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX//Z"
      />
    </div>
  );
}`;
    
    if (!fs.existsSync('src/components')) {
      fs.mkdirSync('src/components', { recursive: true });
    }
    
    fs.writeFileSync(imageComponentPath, imageComponent);
    this.fixes.push('Composant OptimizedImage créé');
    
    // Créer un placeholder SVG
    const placeholderPath = 'public/images/placeholder.svg';
    if (!fs.existsSync('public/images')) {
      fs.mkdirSync('public/images', { recursive: true });
    }
    
    const placeholderSVG = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f3f4f6"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6b7280" font-family="Arial, sans-serif">
    Image indisponible
  </text>
</svg>`;
    
    fs.writeFileSync(placeholderPath, placeholderSVG);
    this.fixes.push('Placeholder SVG créé');
  }
  
  async fixLayoutOverflow(issues) {
    const overflowIssues = issues.filter(i => i.type === 'layout_overflow');
    if (overflowIssues.length === 0) return;
    
        
    const overflowCSS = `
/* Auto-generated overflow fixes */
html, body {
  overflow-x: hidden;
  max-width: 100vw;
}

* {
  max-width: 100%;
}

.fix-overflow {
  overflow: hidden;
  max-width: 100%;
}

.fix-z-index {
  z-index: auto !important;
}

/* Container safety */
.container, .wrapper, .content {
  max-width: min(100vw, 1200px);
  margin: 0 auto;
  padding: 0 1rem;
}
`;
    
    const overflowPath = 'src/styles/overflow-fixes.css';
    fs.writeFileSync(overflowPath, overflowCSS);
    this.fixes.push('CSS overflow généré');
  }
  
  async optimizePerformance(metrics) {
        
    // Créer un next.config.js optimisé
    const nextConfigPath = 'next.config.js';
    let nextConfig = '';
    
    if (fs.existsSync(nextConfigPath)) {
      nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
    }
    
    if (!nextConfig.includes('images:')) {
      const optimizedConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['windventure.fr', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
};

module.exports = nextConfig;`;
      
      fs.writeFileSync(nextConfigPath, optimizedConfig);
      this.fixes.push('Configuration Next.js optimisée');
    }
  }
  
  generateFixReport() {
    );
        );
    
    if (this.fixes.length > 0) {
            this.fixes.forEach(fix => {
              });
    } else {
          }
    
                        
    // Sauvegarder le rapport
    const report = {
      timestamp: new Date().toISOString(),
      fixes: this.fixes,
      nextSteps: [
        'Vérifier les changements',
        'Tester le build',
        'Relancer l\\'analyse',
        'Valider les corrections'
      ]
    };
    
    fs.writeFileSync('auto-fix-report.json', JSON.stringify(report, null, 2));
      }
}

// Exécution
if (require.main === module) {
  const fixer = new VisualAutoFixer();
  fixer.run();
}

module.exports = VisualAutoFixer;