// scripts/auto-fix-windventure-design.js
// Correction automatique des problèmes d'affichage windventure.fr

const fs = require('fs');
const path = require('path');

class WindventureDesignFixer {
  constructor() {
    this.fixes = [];
    this.backups = [];
  }

  async runFixes() {
    console.log('🔧 AUTO-FIX DESIGN WINDVENTURE.FR');
    console.log('═'.repeat(50));
    
    // Lire le rapport de diagnostic s'il existe
    await this.loadDiagnosticReport();
    
    // Corrections automatiques
    await this.fixTailwindConfiguration();
    await this.fixGlobalStyles();
    await this.fixResponsiveClasses();
    await this.fixImageOptimization();
    await this.fixColorScheme();
    await this.fixTypography();
    await this.fixLayoutStructure();
    await this.addMissingAssets();
    
    // Génération du rapport
    this.generateFixReport();
  }

  async loadDiagnosticReport() {
    try {
      const reportPath = path.join(process.cwd(), 'windventure-visual-report.json');
      if (fs.existsSync(reportPath)) {
        this.diagnosticReport = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        console.log('📊 Rapport diagnostic chargé');
      }
    } catch (error) {
      console.log('⚠️ Pas de rapport diagnostic - corrections générales appliquées');
    }
  }

  async fixTailwindConfiguration() {
    console.log('\n🎨 1. Correction configuration Tailwind...');
    
    // Vérifier tailwind.config.js
    const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
    
    const optimizedConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs Windventure (thème kitesurf/océan)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        },
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          900: '#0c4a6e',
        },
        sand: {
          50: '#fefce8',
          100: '#fef3c7',
          500: '#eab308',
          600: '#ca8a04',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}`;
    
    if (fs.existsSync(tailwindConfigPath)) {
      this.backupFile(tailwindConfigPath);
    }
    
    fs.writeFileSync(tailwindConfigPath, optimizedConfig);
    this.fixes.push('✅ Configuration Tailwind optimisée avec thème Windventure');

    // Vérifier globals.css
    const globalsCssPath = path.join(process.cwd(), 'src/app/globals.css');
    const altGlobalsCssPath = path.join(process.cwd(), 'styles/globals.css');
    
    const cssPath = fs.existsSync(globalsCssPath) ? globalsCssPath : altGlobalsCssPath;
    
    const optimizedCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');

/* Base styles */
@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply bg-white text-gray-900 font-sans antialiased;
  }
  
  h1, h2, h3, h4, h5, h6 {
    @apply font-display font-semibold;
  }
  
  h1 {
    @apply text-4xl md:text-5xl lg:text-6xl;
  }
  
  h2 {
    @apply text-3xl md:text-4xl lg:text-5xl;
  }
  
  h3 {
    @apply text-2xl md:text-3xl;
  }
}

/* Component styles */
@layer components {
  .btn {
    @apply inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
  }
  
  .btn-primary {
    @apply bg-ocean-500 text-white hover:bg-ocean-600 focus:ring-ocean-500;
  }
  
  .btn-secondary {
    @apply bg-white text-ocean-600 border-2 border-ocean-500 hover:bg-ocean-50 focus:ring-ocean-500;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-lg overflow-hidden;
  }
  
  .container-custom {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }
  
  .section-padding {
    @apply py-12 md:py-16 lg:py-20;
  }
  
  .hero-gradient {
    @apply bg-gradient-to-br from-ocean-500 via-ocean-600 to-ocean-700;
  }
  
  .text-gradient {
    @apply bg-gradient-to-r from-ocean-500 to-primary-600 bg-clip-text text-transparent;
  }
}

/* Utility classes */
@layer utilities {
  .animation-delay-200 {
    animation-delay: 200ms;
  }
  
  .animation-delay-400 {
    animation-delay: 400ms;
  }
  
  .animation-delay-600 {
    animation-delay: 600ms;
  }
  
  .backdrop-blur-safari {
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

::-webkit-scrollbar-thumb {
  @apply bg-ocean-400 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-ocean-500;
}

/* Responsive images */
img {
  max-width: 100%;
  height: auto;
}

/* Focus styles for accessibility */
*:focus {
  outline: 2px solid theme('colors.ocean.500');
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
}`;
    
    if (fs.existsSync(cssPath)) {
      this.backupFile(cssPath);
      fs.writeFileSync(cssPath, optimizedCSS);
      this.fixes.push('✅ Styles globaux Tailwind optimisés');
    }
  }

  async fixGlobalStyles() {
    console.log('\n🎨 2. Correction des styles globaux...');
    
    // Vérifier _app.js ou layout.js pour l'import CSS
    const possiblePaths = [
      path.join(process.cwd(), 'pages/_app.js'),
      path.join(process.cwd(), 'pages/_app.tsx'),
      path.join(process.cwd(), 'src/app/layout.js'),
      path.join(process.cwd(), 'src/app/layout.tsx')
    ];
    
    const appFilePath = possiblePaths.find(p => fs.existsSync(p));
    
    if (appFilePath) {
      this.backupFile(appFilePath);
      
      let content = fs.readFileSync(appFilePath, 'utf8');
      
      // Vérifier si globals.css est importé
      if (!content.includes('globals.css')) {
        const importStatement = "import '../styles/globals.css';\n";
        
        if (content.includes('import')) {
          // Ajouter après les autres imports
          content = content.replace(/^(import.*?;)$/m, `$1\n${importStatement}`);
        } else {
          // Ajouter au début du fichier
          content = importStatement + content;
        }
        
        fs.writeFileSync(appFilePath, content);
        this.fixes.push('✅ Import globals.css ajouté dans _app');
      }
    }
  }

  async fixResponsiveClasses() {
    console.log('\n📱 3. Correction des classes responsive...');
    
    // Scanner les fichiers composants pour ajouter des classes responsive
    const componentPaths = [
      path.join(process.cwd(), 'components'),
      path.join(process.cwd(), 'src/components'),
      path.join(process.cwd(), 'pages'),
      path.join(process.cwd(), 'src/app')
    ];
    
    componentPaths.forEach(dir => {
      if (fs.existsSync(dir)) {
        this.fixResponsiveInDirectory(dir);
      }
    });
  }

  fixResponsiveInDirectory(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    files.forEach(file => {
      if (file.isDirectory()) {
        this.fixResponsiveInDirectory(path.join(dir, file.name));
      } else if (file.name.match(/\.(js|jsx|ts|tsx)$/)) {
        this.fixResponsiveInFile(path.join(dir, file.name));
      }
    });
  }

  fixResponsiveInFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      // Corrections communes pour le responsive
      const fixes = [
        // Container sans responsive -> avec responsive
        { pattern: /className="([^"]*\bcontainer\b[^"]*)"/, replacement: 'className="$1 px-4 sm:px-6 lg:px-8"' },
        
        // Texte sans responsive -> avec responsive
        { pattern: /className="([^"]*\btext-\d+xl\b[^"]*)"/, replacement: (match, classes) => {
          if (!classes.includes('md:') && !classes.includes('lg:')) {
            return `className="${classes} md:text-4xl lg:text-5xl"`;
          }
          return match;
        }},
        
        // Grid sans responsive -> avec responsive
        { pattern: /className="([^"]*\bgrid-cols-\d+\b[^"]*)"/, replacement: (match, classes) => {
          if (!classes.includes('md:') && !classes.includes('lg:')) {
            return `className="${classes} md:grid-cols-2 lg:grid-cols-3"`;
          }
          return match;
        }},
        
        // Padding/Margin sans responsive -> avec responsive
        { pattern: /className="([^"]*\bp[xy]?-\d+\b[^"]*)"/, replacement: (match, classes) => {
          if (!classes.includes('md:') && !classes.includes('lg:')) {
            return `className="${classes} md:px-8 lg:px-12"`;
          }
          return match;
        }}
      ];
      
      fixes.forEach(fix => {
        if (typeof fix.replacement === 'function') {
          content = content.replace(fix.pattern, fix.replacement);
        } else {
          if (fix.pattern.test(content)) {
            content = content.replace(fix.pattern, fix.replacement);
            modified = true;
          }
        }
      });
      
      if (modified) {
        this.backupFile(filePath);
        fs.writeFileSync(filePath, content);
        this.fixes.push(`✅ Classes responsive ajoutées: ${path.basename(filePath)}`);
      }
      
    } catch (error) {
      // Ignorer les erreurs de fichiers non-modifiables
    }
  }

  async fixImageOptimization() {
    console.log('\n🖼️ 4. Optimisation des images...');
    
    // Créer le composant Image optimisé si nécessaire
    const componentDir = path.join(process.cwd(), 'components');
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true });
    }
    
    const optimizedImageComponent = `import Image from 'next/image';
import { useState } from 'react';

export default function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  priority = false,
  ...props 
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={\`bg-gray-200 flex items-center justify-center \${className}\`}>
        <span className="text-gray-500 text-sm">Image non disponible</span>
      </div>
    );
  }

  return (
    <div className={\`relative overflow-hidden \${className}\`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={\`transition-opacity duration-300 \${isLoading ? 'opacity-0' : 'opacity-100'}\`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
}`;
    
    const imagePath = path.join(componentDir, 'OptimizedImage.js');
    if (!fs.existsSync(imagePath)) {
      fs.writeFileSync(imagePath, optimizedImageComponent);
      this.fixes.push('✅ Composant OptimizedImage créé');
    }
    
    // Créer les images placeholder si manquantes
    this.createPlaceholderAssets();
  }

  createPlaceholderAssets() {
    const publicDir = path.join(process.cwd(), 'public');
    
    // Créer robot.txt si manquant
    const robotsPath = path.join(publicDir, 'robots.txt');
    if (!fs.existsSync(robotsPath)) {
      const robotsContent = `User-agent: *
Allow: /

Sitemap: https://windventure.fr/sitemap.xml`;
      
      fs.writeFileSync(robotsPath, robotsContent);
      this.fixes.push('✅ robots.txt créé');
    }
  }

  async fixColorScheme() {
    console.log('\n🎨 5. Correction du schéma de couleurs...');
    
    // Créer un fichier de constantes de couleurs
    const constantsDir = path.join(process.cwd(), 'lib');
    if (!fs.existsSync(constantsDir)) {
      fs.mkdirSync(constantsDir, { recursive: true });
    }
    
    const colorsConstant = `// lib/colors.js
// Palette de couleurs Windventure

export const colors = {
  // Couleurs principales (océan/kitesurf)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Bleu principal
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Couleurs océan
  ocean: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Bleu océan
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Couleurs sable/désert
  sand: {
    50: '#fefce8',
    100: '#fef3c7',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316', // Orange sable
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  
  // Couleurs du vent
  wind: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b', // Gris vent
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  }
};

// Gradients prédéfinis
export const gradients = {
  oceanSky: 'from-ocean-400 to-primary-500',
  sunsetOcean: 'from-sand-400 via-sand-500 to-ocean-500',
  windySky: 'from-wind-200 to-primary-300',
  heroGradient: 'from-ocean-600 via-ocean-500 to-primary-600',
};

// Classes CSS prêtes à l'emploi
export const cssClasses = {
  buttons: {
    primary: 'bg-ocean-500 hover:bg-ocean-600 text-white',
    secondary: 'bg-sand-500 hover:bg-sand-600 text-white',
    outline: 'border-2 border-ocean-500 text-ocean-600 hover:bg-ocean-50',
  },
  backgrounds: {
    hero: 'bg-gradient-to-br from-ocean-500 to-primary-600',
    section: 'bg-gradient-to-r from-wind-50 to-ocean-50',
    card: 'bg-white shadow-lg',
  },
  text: {
    hero: 'text-white',
    heading: 'text-wind-900',
    body: 'text-wind-700',
    muted: 'text-wind-500',
  }
};`;
    
    const colorsPath = path.join(constantsDir, 'colors.js');
    fs.writeFileSync(colorsPath, colorsConstant);
    this.fixes.push('✅ Palette de couleurs Windventure créée');
  }

  async fixTypography() {
    console.log('\n📝 6. Correction de la typographie...');
    
    // Créer le fichier de constantes typographiques
    const typographyConstant = `// lib/typography.js
// Configuration typographique Windventure

export const typography = {
  fonts: {
    sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
  },
  
  sizes: {
    xs: 'text-xs', // 12px
    sm: 'text-sm', // 14px  
    base: 'text-base', // 16px
    lg: 'text-lg', // 18px
    xl: 'text-xl', // 20px
    '2xl': 'text-2xl', // 24px
    '3xl': 'text-3xl', // 30px
    '4xl': 'text-4xl', // 36px
    '5xl': 'text-5xl', // 48px
    '6xl': 'text-6xl', // 60px
  },
  
  responsive: {
    h1: 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
    h2: 'text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
    h3: 'text-2xl md:text-3xl lg:text-4xl',
    h4: 'text-xl md:text-2xl lg:text-3xl',
    hero: 'text-5xl md:text-6xl lg:text-7xl xl:text-8xl',
    subtitle: 'text-lg md:text-xl lg:text-2xl',
    body: 'text-base md:text-lg',
  },
  
  weights: {
    light: 'font-light',      // 300
    normal: 'font-normal',    // 400
    medium: 'font-medium',    // 500
    semibold: 'font-semibold', // 600
    bold: 'font-bold',        // 700
    extrabold: 'font-extrabold', // 800
  },
  
  combinations: {
    heroTitle: 'font-display font-bold text-5xl md:text-6xl lg:text-7xl',
    sectionTitle: 'font-display font-semibold text-3xl md:text-4xl lg:text-5xl',
    cardTitle: 'font-display font-semibold text-xl md:text-2xl',
    bodyText: 'font-sans font-normal text-base md:text-lg leading-relaxed',
    caption: 'font-sans font-medium text-sm text-wind-600',
  }
};`;
    
    const typographyPath = path.join(process.cwd(), 'lib/typography.js');
    fs.writeFileSync(typographyPath, typographyConstant);
    this.fixes.push('✅ Configuration typographique créée');
  }

  async fixLayoutStructure() {
    console.log('\n📐 7. Correction de la structure layout...');
    
    // Créer des composants layout de base
    const layoutsDir = path.join(process.cwd(), 'components/layouts');
    if (!fs.existsSync(layoutsDir)) {
      fs.mkdirSync(layoutsDir, { recursive: true });
    }
    
    // Layout principal
    const mainLayout = `import Head from 'next/head';
import Header from '../Header';
import Footer from '../Footer';

export default function Layout({ children, title = 'Windventure - Kitesurf à Dakhla' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="École de kitesurf professionnelle à Dakhla, Maroc. Instructeurs IKO certifiés, conditions parfaites toute l'année." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          {children}
        </main>
        
        <Footer />
      </div>
    </>
  );
}`;
    
    const layoutPath = path.join(layoutsDir, 'Layout.js');
    if (!fs.existsSync(layoutPath)) {
      fs.writeFileSync(layoutPath, mainLayout);
      this.fixes.push('✅ Layout principal créé');
    }
    
    // Container responsive
    const containerComponent = `export default function Container({ 
  children, 
  className = '', 
  size = 'default' 
}) {
  const sizeClasses = {
    sm: 'max-w-4xl',
    default: 'max-w-7xl',
    lg: 'max-w-8xl',
    full: 'max-w-full'
  };
  
  return (
    <div className={\`\${sizeClasses[size]} mx-auto px-4 sm:px-6 lg:px-8 \${className}\`}>
      {children}
    </div>
  );
}`;
    
    const containerPath = path.join(process.cwd(), 'components/Container.js');
    if (!fs.existsSync(containerPath)) {
      fs.writeFileSync(containerPath, containerComponent);
      this.fixes.push('✅ Composant Container responsive créé');
    }
  }

  async addMissingAssets() {
    console.log('\n📁 8. Ajout des assets manquants...');
    
    // Créer le next.config.js optimisé si nécessaire
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    
    const optimizedNextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Optimisation des images
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['windventure.fr', 'images.unsplash.com'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Headers de sécurité (CSP déjà configuré dans middleware)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
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
        ],
      },
    ];
  },
  
  // Redirections
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // Webpack config pour optimisations
  webpack: (config, { dev, isServer }) => {
    // Optimisations pour la production
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;`;
    
    if (!fs.existsSync(nextConfigPath)) {
      fs.writeFileSync(nextConfigPath, optimizedNextConfig);
      this.fixes.push('✅ next.config.js optimisé créé');
    }
  }

  backupFile(filePath) {
    try {
      const backupPath = `${filePath}.backup-${Date.now()}`;
      fs.copyFileSync(filePath, backupPath);
      this.backups.push({
        original: filePath,
        backup: backupPath
      });
    } catch (error) {
      // Ignorer les erreurs de backup
    }
  }

  generateFixReport() {
    console.log('\n📊 RAPPORT DE CORRECTIONS');
    console.log('═'.repeat(50));
    
    console.log(`✅ Corrections appliquées: ${this.fixes.length}`);
    console.log(`💾 Backups créés: ${this.backups.length}`);
    
    if (this.fixes.length > 0) {
      console.log('\n🔧 CORRECTIONS APPLIQUÉES:');
      this.fixes.forEach((fix, index) => {
        console.log(`   ${index + 1}. ${fix}`);
      });
    }
    
    if (this.backups.length > 0) {
      console.log('\n💾 FICHIERS SAUVEGARDÉS:');
      this.backups.forEach(backup => {
        console.log(`   📄 ${path.basename(backup.original)} → ${path.basename(backup.backup)}`);
      });
    }
    
    console.log('\n🚀 PROCHAINES ÉTAPES:');
    console.log('   1. npm run dev - Tester en développement');
    console.log('   2. npm run build - Vérifier la compilation');
    console.log('   3. npm run visual-diagnostic - Revalider l\'affichage');
    console.log('   4. git add . && git commit - Sauvegarder les changements');
    
    console.log('\n⚠️ RESTAURATION:');
    console.log('   Si problème, restaurez avec:');
    this.backups.forEach(backup => {
      console.log(`   cp ${backup.backup} ${backup.original}`);
    });
    
    console.log('═'.repeat(50));
  }
}

// Exécution
if (require.main === module) {
  const fixer = new WindventureDesignFixer();
  fixer.runFixes().catch(console.error);
}

module.exports = WindventureDesignFixer;