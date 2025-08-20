// lib/typography.js
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
};