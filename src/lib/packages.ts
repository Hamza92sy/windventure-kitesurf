// 📦 Windventure Packages Configuration
// Données centralisées pour tous les packages kitesurf

export interface Package {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'beginner' | 'exploration' | 'combined';
  features: string[];
  image: string;
  isPopular?: boolean;
  duration?: string;
  maxParticipants?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  includes?: string[];
  requirements?: string[];
  highlights?: string[];
}

// Configuration des couleurs par catégorie
export const categoryColors = {
  beginner: 'from-emerald-500 to-teal-600',
  exploration: 'from-orange-500 to-red-600',
  combined: 'from-purple-600 to-pink-600',
} as const;

// Données des packages centralisées
export const PACKAGES_DATA: Package[] = [
  {
    id: 'beginner-private',
    title: 'Beginner Package (Private)',
    description:
      "Master kitesurfing with personalized one-on-one instruction in Dakhla's perfect lagoon conditions.",
    price: 720,
    image: '/images/dakhla/dakhla-lagoon-1.jpg',
    category: 'beginner',
    duration: '6 hours',
    maxParticipants: 1,
    difficulty: 'beginner',
    features: [
      'Private instructor',
      'All equipment included',
      '6 hours training',
      'Safety briefing',
      'Progress assessment',
    ],
    includes: [
      'Professional instructor',
      'Kite and board equipment',
      'Safety gear (helmet, life jacket)',
      'Insurance coverage',
      'Certificate of completion',
    ],
    requirements: [
      'No previous experience required',
      'Basic swimming ability',
      'Good physical condition',
      'Minimum age: 12 years',
    ],
    highlights: [
      'Personalized attention',
      'Learn at your own pace',
      'Perfect for complete beginners',
      'Safe lagoon conditions',
    ],
  },
  {
    id: 'beginner-semi-private',
    title: 'Beginner Package (Semi-Private)',
    description:
      "Learn kitesurfing with friends in Dakhla's crystal-clear lagoon. Perfect balance of personal attention.",
    price: 1100,
    image: '/images/dakhla/dakhla-lagoon-2.jpg',
    category: 'beginner',
    duration: '8 hours',
    maxParticipants: 3,
    difficulty: 'beginner',
    features: [
      'Small group (2-3 people)',
      'All equipment included',
      '8 hours training',
      'Shared learning experience',
      'Group dynamics',
    ],
    includes: [
      'Professional instructor',
      'Kite and board equipment',
      'Safety gear (helmet, life jacket)',
      'Insurance coverage',
      'Certificate of completion',
      'Group activities',
    ],
    requirements: [
      'No previous experience required',
      'Basic swimming ability',
      'Good physical condition',
      'Minimum age: 12 years',
    ],
    highlights: [
      'Social learning experience',
      'Cost-effective option',
      'Perfect for friends and families',
      'Motivational group atmosphere',
    ],
  },
  {
    id: 'exploration',
    title: 'Exploration Package',
    description:
      "Explore Dakhla's legendary kitesurf spots from the famous White Dune to Dragon Island.",
    price: 1250,
    image: '/images/dakhla/white-dune-real.jpg',
    category: 'exploration',
    duration: '10 hours',
    maxParticipants: 4,
    difficulty: 'intermediate',
    features: [
      'Multiple locations',
      'Transport included',
      '10 hours coaching',
      'Spot variety',
      'Local insights',
    ],
    includes: [
      'Professional guide',
      'Transport to different spots',
      'Kite and board equipment',
      'Safety gear',
      'Insurance coverage',
      'Local knowledge sharing',
    ],
    requirements: [
      'Basic kitesurfing experience',
      'Good physical condition',
      'Minimum age: 16 years',
      'Ability to ride upwind',
    ],
    highlights: [
      'Discover multiple spots',
      'Experience different conditions',
      'Learn from local experts',
      'Adventure and exploration',
    ],
  },
  {
    id: 'combined',
    title: 'Combined Package',
    description:
      'The ultimate Dakhla kitesurf experience combining technique mastery with exploration.',
    price: 1350,
    image: '/images/dakhla/dragon-island.jpg',
    category: 'combined',
    duration: '12 hours',
    maxParticipants: 3,
    difficulty: 'intermediate',
    isPopular: true,
    features: [
      'Best of both worlds',
      '12 hours training',
      '3 different spots',
      'Technique & adventure',
      'Complete experience',
    ],
    includes: [
      'Professional instructor',
      'Transport to multiple locations',
      'Kite and board equipment',
      'Safety gear',
      'Insurance coverage',
      'Certificate of completion',
      'Photo/video documentation',
    ],
    requirements: [
      'Basic kitesurfing experience',
      'Good physical condition',
      'Minimum age: 16 years',
      'Ability to ride upwind',
    ],
    highlights: [
      'Comprehensive experience',
      'Technique improvement',
      'Spot exploration',
      'Professional documentation',
      'Most popular choice',
    ],
  },
];

// Fonctions utilitaires pour les packages
export const PackageUtils = {
  /**
   * Trouve un package par son ID
   */
  findById: (id: string): Package | undefined => {
    return PACKAGES_DATA.find(pkg => pkg.id === id);
  },

  /**
   * Filtre les packages par catégorie
   */
  filterByCategory: (category: Package['category']): Package[] => {
    return PACKAGES_DATA.filter(pkg => pkg.category === category);
  },

  /**
   * Trouve les packages populaires
   */
  getPopular: (): Package[] => {
    return PACKAGES_DATA.filter(pkg => pkg.isPopular);
  },

  /**
   * Calcule le prix total pour un nombre de participants
   */
  calculateTotalPrice: (packageId: string, participants: number): number => {
    const pkg = PackageUtils.findById(packageId);
    if (!pkg) return 0;
    return pkg.price * participants;
  },

  /**
   * Vérifie si un package est disponible pour un nombre de participants
   */
  isAvailableForParticipants: (
    packageId: string,
    participants: number
  ): boolean => {
    const pkg = PackageUtils.findById(packageId);
    if (!pkg) return false;
    return !pkg.maxParticipants || participants <= pkg.maxParticipants;
  },

  /**
   * Obtient la couleur de catégorie pour un package
   */
  getCategoryColor: (packageId: string): string => {
    const pkg = PackageUtils.findById(packageId);
    if (!pkg) return categoryColors.beginner;
    return categoryColors[pkg.category];
  },

  /**
   * Génère les métadonnées SEO pour un package
   */
  getSeoMetadata: (packageId: string) => {
    const pkg = PackageUtils.findById(packageId);
    if (!pkg) return null;

    return {
      title: `${pkg.title} - Windventure Dakhla`,
      description: pkg.description,
      keywords: [
        'kitesurf',
        'dakhla',
        'morocco',
        pkg.category,
        'kitesurfing lessons',
        'windventure',
      ].join(', '),
      price: pkg.price,
      duration: pkg.duration,
    };
  },
};

// Export par défaut
const packagesModule = {
  PACKAGES_DATA,
  categoryColors,
  PackageUtils,
};

export default packagesModule;
