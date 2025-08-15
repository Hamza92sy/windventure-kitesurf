import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 🌊 DAKHLA DESERT-OCEAN PALETTE
        ocean: '#93dbe9', // accents et liens
        sand: '#e0dacd', // background général
        desert: '#c2b280', // Hero
        sky: '#f0f9ff', // base clair
        night: '#0f172a', // overlay ou texte

        // 🌊 DAKHLA SPECIFIC COLORS (legacy)
        'ocean-cyan': '#93dbe9',
        'sand-gold': '#e0dacd',
        'desert-orange': '#c2b280',
        'oasis-green': '#10b981',

        // 🎨 GLASS MORPHISM
        'glass-white': 'rgba(255, 255, 255, 0.05)',
        'glass-ocean': 'rgba(147, 219, 233, 0.05)',

        // 🌌 BACKGROUNDS
        'dakhla-black': '#0f172a',
        'dakhla-dark': '#1e293b',
        'dakhla-gray': '#334155',
      },
      fontFamily: {
        sans: ['Orbitron', 'ui-sans-serif', 'system-ui'],
        matrix: ['Orbitron', 'monospace'],
        hologram: ['Orbitron', 'sans-serif'],
        interface: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'neon-pulse': 'neonPulse 2s ease-in-out infinite alternate',
        'matrix-rain': 'matrixRain 3s linear infinite',
        holographic: 'holographic 4s ease-in-out infinite',
        'neural-pulse': 'neuralPulse 1.5s ease-in-out infinite',
        'particle-float': 'particleFloat 6s linear infinite',
      },
      keyframes: {
        neonPulse: {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
        matrixRain: {
          '0%': { transform: 'translateY(-100vh)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
        holographic: {
          '0%, 100%': { filter: 'hue-rotate(0deg)' },
          '50%': { filter: 'hue-rotate(180deg)' },
        },
        neuralPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        particleFloat: {
          '0%': {
            transform: 'translateY(100vh) rotate(0deg)',
            opacity: '0',
          },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': {
            transform: 'translateY(-100vh) rotate(360deg)',
            opacity: '0',
          },
        },
      },
      backgroundImage: {
        'gradient-futuristic':
          'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(139, 92, 246, 0.1) 25%, rgba(236, 72, 153, 0.1) 50%, rgba(16, 185, 129, 0.1) 75%, rgba(0, 212, 255, 0.1) 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'matrix-rain':
          'linear-gradient(180deg, transparent, #10b981, transparent)',
        holographic: 'linear-gradient(45deg, #00d4ff, #8b5cf6, #ec4899)',
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 212, 255, 0.3)',
        'neon-magenta': '0 0 20px rgba(236, 72, 153, 0.3)',
        'neon-green': '0 0 20px rgba(16, 185, 129, 0.3)',
        'neon-violet': '0 0 20px rgba(139, 92, 246, 0.3)',
        glass: '0 8px 32px rgba(0, 212, 255, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    // NOTE: Install additional plugins if needed:
    // npm install @tailwindcss/typography @tailwindcss/forms @tailwindcss/aspect-ratio
    // require("@tailwindcss/typography"),
    // require("@tailwindcss/forms"),
    // require("@tailwindcss/aspect-ratio"),
  ],
};

export default config;
