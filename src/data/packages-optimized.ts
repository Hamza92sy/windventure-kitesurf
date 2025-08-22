// 🎯 PACKAGES WINDVENTURE - BUSINESS PLAN OPTIMISÉ
// Prix calibrés pour rentabilité 68-115k€/an (+58% avec 4 personnes!)

export interface Package {
  id: string;
  name: string;
  price: number; // Prix par personne
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

export const packagesOptimized: Package[] = [
  {
    id: 'beginner-private',
    name: 'Beginner Private',
    price: 720, // ✅ Rentable : +88€ marge
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
      '3 days training',
      'Safety briefing',
      'Progress assessment'
    ]
  },
  {
    id: 'semi-private-discovery',
    name: 'Semi-Private Discovery',
    price: 380, // ✅ Rentable : +692€ marge (4 pers max) - 88% boost!
    duration: '3 Days',
    shortDescription: 'Learn kitesurfing with friends in small groups',
    stripeProductId: 'price_NEW_SEMI_PRIVATE_DISCOVERY',
    description: "Learn kitesurfing with friends in Dakhla's crystal-clear lagoon. Perfect balance of personal attention.",
    category: 'beginner',
    maxParticipants: 4,
    difficulty: 'beginner',
    image: '/images/dakhla/dakhla-lagoon-2.jpg',
    isPopular: true,
    features: [
      'Small group (max 4 people)',
      'All equipment included',
      '3 days training',
      'Shared learning experience'
    ]
  },
  {
    id: 'semi-private-experience',
    name: 'Semi-Private Experience',
    price: 580, // ✅ Rentable : +972€ marge (4 pers max) - 103% boost!
    duration: '5 Days',
    shortDescription: '5-day intermediate kitesurfing experience',
    stripeProductId: 'price_NEW_SEMI_PRIVATE_EXPERIENCE',
    description: "5-day intensive kitesurfing experience in Dakhla's best conditions.",
    category: 'exploration',
    maxParticipants: 4,
    difficulty: 'intermediate',
    image: '/images/dakhla/white-dune-real.jpg',
    features: [
      'Multiple locations',
      'Transport included',
      '5 days coaching',
      'Spot variety'
    ]
  },
  {
    id: 'exploration-adventure',
    name: 'Exploration Adventure',
    price: 750, // ✅ Rentable : +1350€ marge (4 pers max) - 89% boost!
    duration: '6 Days',
    shortDescription: '6-day kitesurfing exploration experience',
    stripeProductId: 'price_NEW_EXPLORATION_ADVENTURE',
    description: "Explore Dakhla's legendary kitesurf spots from White Dune to Dragon Island.",
    category: 'exploration',
    maxParticipants: 4,
    difficulty: 'intermediate',
    image: '/images/dakhla/white-dune-real.jpg',
    features: [
      'Multiple locations',
      'Transport included',
      '6 days coaching',
      'Spot variety',
      'Local insights'
    ]
  },
  {
    id: 'combined-ultimate',
    name: 'Combined Ultimate',
    price: 950, // ✅ Rentable : +1830€ marge (4 pers max) - 79% boost!
    duration: '7 Days',
    shortDescription: '7-day premium kitesurfing adventure',
    stripeProductId: 'price_NEW_COMBINED_ULTIMATE',
    description: 'The ultimate Dakhla kitesurf experience combining technique mastery with exploration.',
    category: 'combined',
    maxParticipants: 4,
    difficulty: 'intermediate',
    isPopular: true,
    image: '/images/dakhla/dragon-island.jpg',
    features: [
      'Best of both worlds',
      '7 days training',
      '3 different spots',
      'Technique & adventure',
      'Complete experience'
    ]
  }
];

// Fonction utilitaire pour calculer le prix total
export const calculatePackageTotal = (packageId: string, participants: number): number => {
  const pkg = packagesOptimized.find(p => p.id === packageId);
  if (!pkg) return 0;
  
  // Vérifier la limite de participants
  if (pkg.maxParticipants && participants > pkg.maxParticipants) {
    throw new Error(`Maximum ${pkg.maxParticipants} participants for ${pkg.name}`);
  }
  
  return pkg.price * participants;
};

export default packagesOptimized;