// 📦 NOUVEAUX PACKAGES WINDVENTURE - VERSION DE TEST
// Utiliser ce fichier temporairement pour la migration sécurisée

export interface Package {
  id: string;
  name: string;
  price: number;
  duration: string;
  shortDescription: string;
  stripeProductId: string;
  description?: string;
  features?: string[];
  includes?: string[];
  requirements?: string[];
  highlights?: string[];
  category?: 'beginner' | 'exploration' | 'combined';
  maxParticipants?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  isPopular?: boolean;
  image?: string;
}

export const packagesNew: Package[] = [
  {
    id: 'beginner-private',
    name: 'Beginner Private',
    price: 720,
    duration: '3 Days',
    shortDescription: 'Master kitesurfing with personalized one-on-one instruction',
    stripeProductId: 'price_1Reo9xHUqGxCezEFwTKoXkzJ',
    description: "Master kitesurfing with personalized one-on-one instruction in Dakhla's perfect lagoon conditions.",
    category: 'beginner',
    maxParticipants: 1,
    difficulty: 'beginner',
    image: '/images/dakhla/dakhla-lagoon-1.jpg',
    features: [
      'Private instructor',
      'All equipment included',
      '6 hours training',
      'Safety briefing',
      'Progress assessment'
    ],
    includes: [
      'Professional instructor',
      'Kite and board equipment',
      'Safety gear (helmet, life jacket)',
      'Insurance coverage',
      'Certificate of completion'
    ],
    requirements: [
      'No previous experience required',
      'Basic swimming ability',
      'Good physical condition',
      'Minimum age: 12 years'
    ],
    highlights: [
      'Personalized attention',
      'Learn at your own pace',
      'Perfect for complete beginners',
      'Safe lagoon conditions'
    ]
  },
  {
    id: 'beginner-semi-private',
    name: 'Beginner Semi-Private',
    price: 1100,
    duration: '6 Days',
    shortDescription: '6-day kitesurfing course in Dakhla, Morocco',
    stripeProductId: 'price_1Reo8SHUqGxCezEF3ca4QL34',
    description: "Learn kitesurfing with friends in Dakhla's crystal-clear lagoon. Perfect balance of personal attention.",
    category: 'beginner',
    maxParticipants: 3,
    difficulty: 'beginner',
    image: '/images/dakhla/dakhla-lagoon-2.jpg',
    features: [
      'Small group (2-3 people)',
      'All equipment included',
      '8 hours training',
      'Shared learning experience',
      'Group dynamics'
    ],
    includes: [
      'Professional instructor',
      'Kite and board equipment',
      'Safety gear (helmet, life jacket)',
      'Insurance coverage',
      'Certificate of completion',
      'Group activities'
    ],
    requirements: [
      'No previous experience required',
      'Basic swimming ability',
      'Good physical condition',
      'Minimum age: 12 years'
    ],
    highlights: [
      'Social learning experience',
      'Cost-effective option',
      'Perfect for friends and families',
      'Motivational group atmosphere'
    ]
  },
  {
    id: 'exploration',
    name: 'Exploration Package',
    price: 1250,
    duration: '5 Days',
    shortDescription: '5-day kitesurfing exploration experience in Dakhla',
    stripeProductId: 'price_1ReoC9HUqGxCezEFSDRUrGTz',
    description: "Explore Dakhla's legendary kitesurf spots from the famous White Dune to Dragon Island.",
    category: 'exploration',
    maxParticipants: 4,
    difficulty: 'intermediate',
    image: '/images/dakhla/white-dune-real.jpg',
    features: [
      'Multiple locations',
      'Transport included',
      '10 hours coaching',
      'Spot variety',
      'Local insights'
    ],
    includes: [
      'Professional guide',
      'Transport to different spots',
      'Kite and board equipment',
      'Safety gear',
      'Insurance coverage',
      'Local knowledge sharing'
    ],
    requirements: [
      'Basic kitesurfing experience',
      'Good physical condition',
      'Minimum age: 16 years',
      'Ability to ride upwind'
    ],
    highlights: [
      'Discover multiple spots',
      'Experience different conditions',
      'Learn from local experts',
      'Adventure and exploration'
    ]
  },
  {
    id: 'combined',
    name: 'Combined Package',
    price: 1350,
    duration: '5 Days',
    shortDescription: '5-day premium kitesurfing adventure in Dakhla',
    stripeProductId: 'price_1ReoApHUqGxCezEFCuWVKKGB',
    description: 'The ultimate Dakhla kitesurf experience combining technique mastery with exploration.',
    category: 'combined',
    maxParticipants: 3,
    difficulty: 'intermediate',
    isPopular: true,
    image: '/images/dakhla/dragon-island.jpg',
    features: [
      'Best of both worlds',
      '12 hours training',
      '3 different spots',
      'Technique & adventure',
      'Complete experience'
    ],
    includes: [
      'Professional instructor',
      'Transport to multiple locations',
      'Kite and board equipment',
      'Safety gear',
      'Insurance coverage',
      'Certificate of completion',
      'Photo/video documentation'
    ],
    requirements: [
      'Basic kitesurfing experience',
      'Good physical condition',
      'Minimum age: 16 years',
      'Ability to ride upwind'
    ],
    highlights: [
      'Comprehensive experience',
      'Technique improvement',
      'Spot exploration',
      'Professional documentation',
      'Most popular choice'
    ]
  }
];

// Fonction utilitaire pour trouver un package par ID
export const findPackageById = (id: string): Package | undefined => {
  return packagesNew.find(pkg => pkg.id === id);
};

// Export par défaut pour compatibilité
export default packagesNew;