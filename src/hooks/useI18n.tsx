'use client';

import { useState, useEffect, createContext, useContext } from 'react';

// Simple i18n implementation for Windventure - Conservative approach
// No external dependencies, just French/English support

export type Language = 'fr' | 'en';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Translation keys and content
const translations = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.packages': 'Packages',
    'nav.about': 'À Propos',
    'nav.equipment': 'Équipement',
    'nav.contact': 'Contact',
    'nav.whatsapp': 'WhatsApp',

    // Common
    'common.book': 'Réserver',
    'common.book_package': 'Réserver ce Package',
    'common.book_adventure': 'Réservez votre Aventure',
    'common.learn_more': 'En savoir plus',
    'common.back_home': "Retour à l'accueil",
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.per_person': 'par personne',
    'common.most_popular': 'Le plus populaire',

    // Homepage
    'home.hero.title': 'Kitesurf à Dakhla',
    'home.hero.subtitle': 'Liberté Électrique',
    'home.hero.description':
      "Découvrez l'ultime expérience de kitesurf dans l'un des spots les plus exceptionnels au monde : la lagune cristalline de Dakhla.",
    'home.hero.cta': 'Découvrir nos Packages',

    // Packages
    'packages.title': 'Packages Kitesurf',
    'packages.subtitle': 'Des aventures sur mesure pour tous les niveaux',
    'packages.description':
      "Embarquez pour l'aventure ultime du vent avec nos expériences de kitesurf expertes. Du débutant au pro, nous avons le package parfait qui vous attend.",
    'packages.features.instructors': 'Instructeurs Certifiés',
    'packages.features.equipment': 'Équipement Premium',
    'packages.features.conditions': 'Conditions de Vent Parfaites',
    'packages.cta.title': 'Prêt à Attraper le Vent ?',
    'packages.cta.description':
      "Rejoignez des centaines d'aventuriers satisfaits qui ont découvert le frisson du kitesurf.",

    // Booking
    'booking.title': 'Réservation',
    'booking.form.first_name': 'Prénom',
    'booking.form.last_name': 'Nom',
    'booking.form.email': 'Email',
    'booking.form.phone': 'Téléphone',
    'booking.form.date': 'Date souhaitée',
    'booking.form.participants': 'Nombre de participants',
    'booking.form.notes': 'Demandes spéciales',
    'booking.form.submit': 'Procéder au Paiement',
    'booking.summary': 'Résumé de la réservation',
    'booking.total': 'Prix Total',

    // About
    'about.title': 'Qui Sommes Nous',
    'about.subtitle': 'Votre aventure au cœur de Dakhla',
    'about.description':
      "Depuis plus de 10 ans, Windventure vous fait découvrir les merveilles du kitesurf dans l'un des spots les plus exceptionnels au monde.",

    // Equipment
    'equipment.title': 'Équipement Premium',
    'equipment.subtitle': 'Matériel dernière génération pour votre sécurité',
    'equipment.description':
      'Nous mettons à votre disposition un équipement professionnel régulièrement renouvelé.',

    // Contact
    'contact.title': 'Contactez-nous',
    'contact.subtitle': 'Nous sommes là pour répondre à vos questions',
    'contact.form.name': 'Nom complet',
    'contact.form.subject': 'Sujet',
    'contact.form.message': 'Message',
    'contact.form.send': 'Envoyer',

    // Footer
    'footer.description':
      'Votre école de kitesurf à Dakhla, Maroc. Découvrez la liberté du vent dans un cadre exceptionnel.',
    'footer.quick_links': 'Liens Rapides',
    'footer.contact_info': 'Informations de Contact',
    'footer.follow_us': 'Suivez-nous',
    'footer.address': 'Dakhla, Maroc',
    'footer.phone': '+212 123 456 789',
    'footer.email': 'contact@windventure.fr',
    'footer.copyright': '© 2024 Windventure. Tous droits réservés.',
  },

  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.packages': 'Packages',
    'nav.about': 'About',
    'nav.equipment': 'Equipment',
    'nav.contact': 'Contact',
    'nav.whatsapp': 'WhatsApp',

    // Common
    'common.book': 'Book',
    'common.book_package': 'Book This Package',
    'common.book_adventure': 'Book Your Adventure',
    'common.learn_more': 'Learn more',
    'common.back_home': 'Back to Home',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.per_person': 'per person',
    'common.most_popular': 'Most Popular',

    // Homepage
    'home.hero.title': 'Kitesurfing in Dakhla',
    'home.hero.subtitle': 'Electric Freedom',
    'home.hero.description':
      "Discover the ultimate kitesurfing experience in one of the world's most exceptional spots: Dakhla's crystal clear lagoon.",
    'home.hero.cta': 'Discover our Packages',

    // Packages
    'packages.title': 'Kitesurf Packages',
    'packages.subtitle': 'Tailored adventures for all levels',
    'packages.description':
      'Embark on the ultimate wind adventure with our expertly crafted kitesurfing experiences. From beginners to pros, we have the perfect package waiting for you.',
    'packages.features.instructors': 'Certified Instructors',
    'packages.features.equipment': 'Premium Equipment',
    'packages.features.conditions': 'Perfect Wind Conditions',
    'packages.cta.title': 'Ready to Catch the Wind?',
    'packages.cta.description':
      'Join hundreds of satisfied adventurers who have discovered the thrill of kitesurfing.',

    // Booking
    'booking.title': 'Booking',
    'booking.form.first_name': 'First Name',
    'booking.form.last_name': 'Last Name',
    'booking.form.email': 'Email',
    'booking.form.phone': 'Phone',
    'booking.form.date': 'Preferred Date',
    'booking.form.participants': 'Number of Participants',
    'booking.form.notes': 'Special Requests',
    'booking.form.submit': 'Proceed to Payment',
    'booking.summary': 'Booking Summary',
    'booking.total': 'Total Price',

    // About
    'about.title': 'About Us',
    'about.subtitle': 'Your adventure in the heart of Dakhla',
    'about.description':
      "For over 10 years, Windventure has been introducing you to the wonders of kitesurfing in one of the world's most exceptional spots.",

    // Equipment
    'equipment.title': 'Premium Equipment',
    'equipment.subtitle': 'Latest generation gear for your safety',
    'equipment.description':
      'We provide professional equipment regularly renewed, adapted to all levels and Dakhla conditions.',

    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': "We're here to answer your questions",
    'contact.form.name': 'Full Name',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send',

    // Footer
    'footer.description':
      'Your kitesurfing school in Dakhla, Morocco. Discover the freedom of wind in an exceptional setting.',
    'footer.quick_links': 'Quick Links',
    'footer.contact_info': 'Contact Information',
    'footer.follow_us': 'Follow Us',
    'footer.address': 'Dakhla, Morocco',
    'footer.phone': '+212 123 456 789',
    'footer.email': 'contact@windventure.fr',
    'footer.copyright': '© 2024 Windventure. All rights reserved.',
  },
};

// Custom hook for i18n
export function useI18n() {
  const [language, setLanguageState] = useState<Language>('fr');

  // Load language from localStorage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem(
        'windventure-language'
      ) as Language;
      if (savedLang && (savedLang === 'fr' || savedLang === 'en')) {
        setLanguageState(savedLang);
      } else {
        // Detect browser language
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('fr')) {
          setLanguageState('fr');
        } else {
          setLanguageState('en');
        }
      }
    }
  }, []);

  // Save language preference
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('windventure-language', lang);
    }
  };

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to French if key not found in current language
        value = translations.fr;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            console.warn(`Translation key not found: ${key}`);
            return key; // Return key if no translation found
          }
        }
        break;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return {
    language,
    setLanguage,
    t,
  };
}

// Language switcher component
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useI18n();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={() => setLanguage('fr')}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
          language === 'fr'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
          language === 'en'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
        }`}
      >
        EN
      </button>
    </div>
  );
}

// Get current language (for use in server components)
export function getCurrentLanguage(): Language {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('windventure-language') as Language;
    if (saved && (saved === 'fr' || saved === 'en')) {
      return saved;
    }
  }
  return 'fr'; // Default to French
}
