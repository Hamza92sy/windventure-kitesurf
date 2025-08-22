// 🎯 PACKAGES WINDVENTURE - OPTIMISÉS 4 PERSONNES
// Capacité hébergement : 4 personnes maximum
// Rentabilité validée : 68-115k€/an bénéfice net
// Intégration Stripe complète

export interface Package {
  id: string;
  name: string;
  price: number; // Prix par personne
  maxPersons: number; // Capacité maximum
  duration: string;
  durationDays: number;
  shortDescription: string;
  fullDescription: string;
  included: string[];
  stripeProductId: string;
  stripePriceId: string;
  marginNet: number; // Marge nette à capacité max
  isPopular?: boolean;
  isPremium?: boolean;
  category: 'private' | 'group' | 'premium';
  // Legacy compatibility
  description?: string;
  features?: string[];
  maxParticipants?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  image?: string;
}

export const packagesOptimized: Package[] = [
  // 🟢 PACKAGE PRIVÉ (1 personne)
  {
    id: 'beginner-private',
    name: 'Beginner Private',
    price: 720,
    maxPersons: 1,
    duration: '3 jours',
    durationDays: 3,
    shortDescription: 'Cours privé intensif débutant avec hébergement',
    fullDescription: 'Formation kitesurf privée intensive de 3 jours avec instructeur dédié. Parfait pour débuter en toute confiance avec un accompagnement personnalisé 100% sur-mesure.',
    included: [
      'Hébergement 3 jours en maison d\'hôtes premium',
      'Cours privé exclusif avec instructeur certifié IKO',
      'Matériel premium dernière génération (aile, planche, harnais)',
      'Transport quotidien vers spots optimaux',
      'Transfert aéroport aller-retour inclus',
      'Progression accélérée garantie',
      'Flexibilité horaires et spots selon météo'
    ],
    stripeProductId: process.env.STRIPE_PRODUCT_BEGINNER_PRIVATE || 'price_1Reo9xHUqGxCezEFwTKoXkzJ',
    stripePriceId: process.env.STRIPE_PRICE_BEGINNER_PRIVATE || 'price_1Reo9xHUqGxCezEFwTKoXkzJ',
    marginNet: 12, // 720€ - 108€ instructeur - 600€ charges
    category: 'private',
    // Legacy compatibility
    description: 'Master kitesurfing with personalized one-on-one instruction in Dakhla\'s perfect lagoon conditions.',
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
  
  // 🔵 PACKAGES GROUPE (2-4 personnes)
  {
    id: 'semi-private-discovery',
    name: 'Semi-Private Discovery',
    price: 380,
    maxPersons: 4,
    duration: '3 jours',
    durationDays: 3,
    shortDescription: 'Découverte kitesurf en petit groupe avec hébergement',
    fullDescription: 'Package découverte parfait pour s\'initier au kitesurf en petit groupe convivial. 3 jours d\'apprentissage progressif avec hébergement partagé et liberté culinaire totale pour découvrir Dakhla.',
    included: [
      'Hébergement 3 jours partagé (max 4 personnes)',
      'Cours semi-privé progressive (2-4 élèves par instructeur)',
      'Matériel premium adapté niveau débutant',
      'Transport quotidien vers spots sécurisés',
      'Transfert aéroport aller-retour inclus',
      'Ambiance conviviale garantie petit groupe',
      'Liberté totale restauration (économie 300€ vs concurrence)'
    ],
    stripeProductId: process.env.STRIPE_PRODUCT_DISCOVERY || 'price_NEW_SEMI_PRIVATE_DISCOVERY',
    stripePriceId: process.env.STRIPE_PRICE_DISCOVERY || 'price_NEW_SEMI_PRIVATE_DISCOVERY',
    marginNet: 692, // 1520€ CA (4×380) - 228€ instructeur - 600€ charges
    isPopular: true,
    category: 'group',
    // Legacy compatibility
    description: 'Learn kitesurfing with friends in Dakhla\'s crystal-clear lagoon. Perfect balance of personal attention.',
    maxParticipants: 4,
    difficulty: 'beginner',
    image: '/images/dakhla/dakhla-lagoon-2.jpg',
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
    price: 580,
    maxPersons: 4,
    duration: '5 jours',
    durationDays: 5,
    shortDescription: 'Expérience kitesurf complète en groupe restreint',
    fullDescription: 'Séjour kitesurf de 5 jours pour progresser efficacement du débutant vers l\'autonomie. Format semi-privé idéal pour allier apprentissage de qualité et convivialité de groupe dans la lagune de Dakhla.',
    included: [
      'Hébergement 5 jours confort partagé (max 4 personnes)',
      'Progression cours semi-privé structurée',
      'Matériel premium varié + équipement backup',
      'Transport vers spots diversifiés selon niveau',
      'Transfert aéroport aller-retour inclus',
      'Flexibilité spots selon conditions météo optimales',
      'Sessions théoriques sécurité et météo',
      'Liberté culinaire complète Dakhla authentique'
    ],
    stripeProductId: process.env.STRIPE_PRODUCT_EXPERIENCE || 'price_NEW_SEMI_PRIVATE_EXPERIENCE',
    stripePriceId: process.env.STRIPE_PRICE_EXPERIENCE || 'price_NEW_SEMI_PRIVATE_EXPERIENCE',
    marginNet: 972, // 2320€ CA (4×580) - 348€ instructeur - 1000€ charges
    category: 'group',
    // Legacy compatibility
    description: '5-day intensive kitesurfing experience in Dakhla\'s best conditions.',
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
    id: 'semi-private-exploration',
    name: 'Semi-Private Exploration',
    price: 750,
    maxPersons: 4,
    duration: '6 jours',
    durationDays: 6,
    shortDescription: 'Aventure kitesurf avec exploration spots premium',
    fullDescription: 'Package exploration de 6 jours pour découvrir les spots secrets de Dakhla. Parfait équilibre entre progression technique encadrée et aventure dans les plus beaux spots de la lagune mondiale du kitesurf.',
    included: [
      'Hébergement 6 jours premium partagé (max 4 personnes)',
      'Cours semi-privé + sessions libres encadrées',
      'Exploration spots secrets et premium de Dakhla',
      'Matériel premium dernière génération + choix equipment',
      'Transport 4x4 tout-terrain vers spots exclusifs',
      'Transfert aéroport aller-retour VIP',
      'Briefings météo quotidiens professionnels',
      'Sessions photo/vidéo souvenirs incluses',
      'Découverte gastronomie locale en liberté totale'
    ],
    stripeProductId: process.env.STRIPE_PRODUCT_EXPLORATION || 'price_NEW_EXPLORATION_ADVENTURE',
    stripePriceId: process.env.STRIPE_PRICE_EXPLORATION || 'price_NEW_EXPLORATION_ADVENTURE',
    marginNet: 1350, // 3000€ CA (4×750) - 450€ instructeur - 1200€ charges
    isPopular: true,
    category: 'group',
    // Legacy compatibility
    description: 'Explore Dakhla\'s legendary kitesurf spots from White Dune to Dragon Island.',
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

  // ⭐ PACKAGE PREMIUM (2-4 personnes)
  {
    id: 'combined-ultimate',
    name: 'Combined Ultimate Experience',
    price: 950,
    maxPersons: 4,
    duration: '7 jours',
    durationDays: 7,
    shortDescription: 'Expérience kitesurf ultime - Formation complète Dakhla',
    fullDescription: 'L\'expérience WindVenture ultime ! 7 jours pour maîtriser le kitesurf dans les meilleures conditions de Dakhla. Formation complète avec exploration approfondie de tous les spots légendaires de la lagune.',
    included: [
      'Hébergement 7 jours premium confort (max 4 personnes)',
      'Formation complète débutant → rider autonome',
      'Accès exclusif spots premium et secrets',
      'Matériel haut de gamme varié (multiple ailes/planches)',
      'Transport 4x4 confort vers tous types de spots',
      'Transfert aéroport VIP aller-retour',
      'Coaching personnalisé quotidien progression',
      'Briefings techniques avancés météo/spots',
      'Exploration complète lagune + spots wave',
      'Sessions photo/vidéo pro incluses',
      'Certificat progression IKO inclus',
      'Liberté gastronomique totale Dakhla découverte'
    ],
    stripeProductId: process.env.STRIPE_PRODUCT_ULTIMATE || 'price_NEW_COMBINED_ULTIMATE',
    stripePriceId: process.env.STRIPE_PRICE_ULTIMATE || 'price_NEW_COMBINED_ULTIMATE',
    marginNet: 1830, // 3800€ CA (4×950) - 570€ instructeur - 1400€ charges
    isPremium: true,
    category: 'premium',
    // Legacy compatibility
    description: 'The ultimate Dakhla kitesurf experience combining technique mastery with exploration.',
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

// 📊 MÉTRIQUES BUSINESS OPTIMISÉES 4 PERSONNES
export const businessMetrics = {
  // Capacité hébergement
  maxCapacity: 4,
  
  // Charges fixes quotidiennes (€)
  dailyFixedCosts: {
    accommodation: 63, // Moyenne 500-700 DH/jour = 47-66€
    transport: 142,    // 1500 DH/jour
    total: 205
  },
  
  // Pourcentage instructeur
  instructorPercentage: 0.15,
  
  // Projections CA à capacité max par package
  maxRevenueByPackage: {
    "beginner-private": 720,         // 1 pers × 720€
    "semi-private-discovery": 1520,  // 4 pers × 380€  
    "semi-private-experience": 2320, // 4 pers × 580€
    "exploration-adventure": 3000,   // 4 pers × 750€
    "combined-ultimate": 3800        // 4 pers × 950€
  },
  
  // Marges nettes à capacité max (€)
  maxMarginByPackage: {
    "beginner-private": 12,
    "semi-private-discovery": 692,
    "semi-private-experience": 972,
    "exploration-adventure": 1350,
    "combined-ultimate": 1830
  },
  
  // Objectifs business validés
  targetsWeekly: {
    conservative: 10,  // clients/semaine → 68k€/an net
    optimistic: 15     // clients/semaine → 115k€/an net
  },

  // Rentabilité par catégorie
  profitabilityByCategory: {
    'private': 12,      // Marge minimale mais premium service
    'group': 1005,      // Moyenne 692+972+1350 / 3
    'premium': 1830     // Marge maximum expérience ultime
  }
};

// 🎯 UTILS FONCTIONS BUSINESS
export const packageUtils = {
  // Calculer prix total pour X personnes
  calculateTotalPrice: (packageId: string, persons: number): number => {
    const pkg = packagesOptimized.find(p => p.id === packageId);
    if (!pkg) throw new Error(`Package ${packageId} non trouvé`);
    
    if (pkg.category === 'private') {
      return pkg.price; // Prix fixe pour package privé
    }
    
    const validPersons = Math.min(persons, pkg.maxPersons);
    return pkg.price * validPersons;
  },

  // Calculer marge nette pour X personnes
  calculateNetMargin: (packageId: string, persons: number): number => {
    const pkg = packagesOptimized.find(p => p.id === packageId);
    if (!pkg) return 0;
    
    const totalRevenue = packageUtils.calculateTotalPrice(packageId, persons);
    const instructorCost = totalRevenue * businessMetrics.instructorPercentage;
    const fixedCosts = businessMetrics.dailyFixedCosts.total * pkg.durationDays;
    
    return totalRevenue - instructorCost - fixedCosts;
  },

  // Valider nombre de personnes
  validatePersonCount: (packageId: string, persons: number): boolean => {
    const pkg = packagesOptimized.find(p => p.id === packageId);
    if (!pkg) return false;
    
    return persons >= 1 && persons <= pkg.maxPersons;
  },

  // Obtenir packages populaires
  getPopularPackages: () => {
    return packagesOptimized.filter(pkg => pkg.isPopular);
  },

  // Obtenir packages par catégorie
  getPackagesByCategory: (category: Package['category']) => {
    return packagesOptimized.filter(pkg => pkg.category === category);
  }
};

// 🎯 STRATÉGIE PRICING DIFFÉRENCIÉE
export const pricingStrategy = {
  positioning: "Premium sans restauration - Liberté culinaire",
  competitive_advantage: "300€ économies vs concurrence pension complète",
  target_market: "Clientèle internationale premium 25-45 ans",
  seasonality: "Octobre à Mai (6-8 mois activité optimale)",
  
  // Messages marketing clés
  marketing_messages: [
    "Hébergement + Kitesurf + Liberté culinaire totale",
    "Explorez la gastronomie authentique de Dakhla", 
    "Prix transparent par personne, sans pension imposée",
    "Capacité limitée 4 personnes = expérience premium exclusive",
    "Économisez 300€ vs packages pension complète traditionnels"
  ],

  // USPs uniques
  unique_selling_points: [
    "Seule école Dakhla avec pricing transparent par personne",
    "Maximum 4 personnes = ratio instructeur optimal",
    "Hébergement partagé convivial premium",
    "Liberté culinaire découverte Dakhla authentique",
    "Progression garantie ou remboursement"
  ]
};

// Legacy compatibility - keeping old function name
export const calculatePackageTotal = (packageId: string, participants: number): number => {
  return packageUtils.calculateTotalPrice(packageId, participants);
};

// ✅ STANDARDIZED EXPORTS FOR CONSISTENCY
export const optimizedPackages = packagesOptimized;
export const packages = packagesOptimized; // Alias for legacy compatibility
export const PACKAGES_DATA = packagesOptimized; // Alias for components expecting this name

export default optimizedPackages;