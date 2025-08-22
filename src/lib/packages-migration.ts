// 🚀 MIGRATION PACKAGES - SYSTÈME OPTIMISÉ 4 PERSONNES
// Remplace progressivement les imports vers packages-optimized.ts

// Import depuis le fichier optimisé
export { 
  packagesOptimized as PACKAGES_DATA,
  calculatePackageTotal as PackageUtils_calculateTotalPrice,
  type Package
} from '../data/packages-optimized';

// Fonctions utilitaires de migration
export const MigrationUtils = {
  /**
   * Trouve un package par son ID
   */
  findById: (id: string) => {
    const { packagesOptimized } = require('../data/packages-optimized');
    return packagesOptimized.find((pkg: any) => pkg.id === id);
  },

  /**
   * Vérifie la compatibilité avec l'ancien système
   */
  isLegacyCompatible: (packageId: string): boolean => {
    const legacyIds = ['beginner-private', 'beginner-semi-private', 'exploration', 'combined'];
    return legacyIds.includes(packageId);
  },

  /**
   * Mappe les anciens IDs vers les nouveaux
   */
  mapLegacyToOptimized: (legacyId: string): string => {
    const mapping: Record<string, string> = {
      'beginner-semi-private': 'semi-private-discovery', // Nouveau système
      'exploration': 'exploration-adventure',
      'combined': 'combined-ultimate'
    };
    return mapping[legacyId] || legacyId;
  },

  /**
   * Génère les nouveaux prix Stripe nécessaires
   */
  getRequiredStripePrices: () => [
    { id: 'semi-private-discovery', price: 380, name: 'Semi-Private Discovery (3j)' },
    { id: 'semi-private-experience', price: 580, name: 'Semi-Private Experience (5j)' },  
    { id: 'exploration-adventure', price: 750, name: 'Exploration Adventure (6j)' },
    { id: 'combined-ultimate', price: 950, name: 'Combined Ultimate Experience (7j)' }
  ]
};

export default MigrationUtils;