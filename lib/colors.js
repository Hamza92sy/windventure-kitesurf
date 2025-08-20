// lib/colors.js
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
};