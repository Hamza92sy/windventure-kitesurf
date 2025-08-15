// ♿ Windventure Accessibility Utilities
// Fonctions pour améliorer l'accessibilité du site

/**
 * Calcule le ratio de contraste entre deux couleurs
 * @param color1 - Première couleur (hex)
 * @param color2 - Deuxième couleur (hex)
 * @returns Ratio de contraste
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calcule la luminance relative d'une couleur
 * @param color - Couleur hexadécimale
 * @returns Luminance relative
 */
function getLuminance(color: string): number {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
}

/**
 * Vérifie si un ratio de contraste respecte les standards WCAG
 * @param ratio - Ratio de contraste
 * @param level - Niveau WCAG ('AA' ou 'AAA')
 * @param size - Taille du texte ('normal' ou 'large')
 * @returns true si le contraste est suffisant
 */
export function isContrastSufficient(
  ratio: number,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const thresholds = {
    AA: { normal: 4.5, large: 3 },
    AAA: { normal: 7, large: 4.5 },
  };

  return ratio >= thresholds[level][size];
}

/**
 * Palette de couleurs Dakhla avec vérification de contraste
 */
export const DakhlaColors = {
  ocean: '#93dbe9',
  sand: '#e0dacd',
  desert: '#c2b280',
  sky: '#f0f9ff',
  night: '#0f172a',

  // Vérification des contrastes critiques
  getContrastInfo: () => {
    const combinations = [
      { bg: '#93dbe9', fg: '#0f172a', name: 'Ocean on Night' },
      { bg: '#e0dacd', fg: '#0f172a', name: 'Sand on Night' },
      { bg: '#f0f9ff', fg: '#0f172a', name: 'Sky on Night' },
      { bg: '#93dbe9', fg: '#ffffff', name: 'Ocean on White' },
      { bg: '#e0dacd', fg: '#ffffff', name: 'Sand on White' },
    ];

    return combinations.map(combo => {
      const ratio = calculateContrastRatio(combo.bg, combo.fg);
      const aaNormal = isContrastSufficient(ratio, 'AA', 'normal');
      const aaLarge = isContrastSufficient(ratio, 'AA', 'large');

      return {
        ...combo,
        ratio: Math.round(ratio * 100) / 100,
        aaNormal,
        aaLarge,
        status: aaNormal ? '✅' : aaLarge ? '⚠️' : '❌',
      };
    });
  },
};

/**
 * Fonctions d'accessibilité pour les composants
 */
export const AccessibilityUtils = {
  /**
   * Génère un ID unique pour les éléments d'accessibilité
   */
  generateId: (prefix: string): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Vérifie si un élément est visible à l'écran
   */
  isElementVisible: (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  },

  /**
   * Vérifie si un élément est focusable
   */
  isFocusable: (element: HTMLElement): boolean => {
    const tabIndex = element.tabIndex;
    const disabled = element.hasAttribute('disabled');
    const hidden = element.hasAttribute('hidden');

    return tabIndex >= 0 && !disabled && !hidden;
  },

  /**
   * Ajoute des attributs ARIA pour l'accessibilité
   */
  addAriaAttributes: (
    element: HTMLElement,
    attributes: Record<string, string>
  ) => {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  },
};

/**
 * Hooks d'accessibilité pour React
 */
export const useAccessibility = () => {
  const generateId = (prefix: string) => AccessibilityUtils.generateId(prefix);

  const addAriaAttributes = (attributes: Record<string, string>) => {
    return AccessibilityUtils.addAriaAttributes;
  };

  const checkContrast = (bgColor: string, fgColor: string) => {
    const ratio = calculateContrastRatio(bgColor, fgColor);
    return {
      ratio,
      isSufficient: isContrastSufficient(ratio),
      level: isContrastSufficient(ratio, 'AAA')
        ? 'AAA'
        : isContrastSufficient(ratio, 'AA')
          ? 'AA'
          : 'FAIL',
    };
  };

  return {
    generateId,
    addAriaAttributes,
    checkContrast,
    DakhlaColors,
  };
};

/**
 * Configuration d'accessibilité pour Windventure
 */
export const AccessibilityConfig = {
  // Contraste minimum requis
  minContrastRatio: 4.5, // WCAG AA

  // Tailles de texte
  textSizes: {
    small: '14px',
    normal: '16px',
    large: '18px',
    xlarge: '24px',
  },

  // Espacement pour les touch targets
  touchTargets: {
    minSize: '44px',
    minSpacing: '8px',
  },

  // Animations et transitions
  animations: {
    respectReducedMotion: true,
    maxDuration: '500ms',
  },

  // Navigation au clavier
  keyboard: {
    focusVisible: true,
    skipLinks: true,
    logicalTabOrder: true,
  },
};

const accessibilityModule = {
  calculateContrastRatio,
  isContrastSufficient,
  DakhlaColors,
  AccessibilityUtils,
  useAccessibility,
  AccessibilityConfig,
};

export default accessibilityModule;
