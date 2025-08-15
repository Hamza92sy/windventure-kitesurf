'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Equipment Section - Conservative component for Windventure
interface EquipmentSectionProps {
  lang?: 'fr' | 'en';
  className?: string;
}

const content = {
  fr: {
    title: 'Équipement Premium',
    subtitle: 'Matériel dernière génération pour votre sécurité',
    description:
      'Nous mettons à votre disposition un équipement professionnel régulièrement renouvelé, adapté à tous les niveaux et aux conditions de Dakhla.',
    categories: [
      {
        id: 'kites',
        name: 'Ailes de Kite',
        icon: '🪁',
        items: [
          {
            name: 'Duotone Evo',
            description:
              "Aile polyvalente, idéale pour l'apprentissage et le perfectionnement",
            specs: ['9m - 12m - 14m', 'Très stable', 'Redécollage facile'],
            image: '/images/equipment/kite-duotone-evo.jpg',
          },
          {
            name: 'Cabrinha Switchblade',
            description:
              'Performance et contrôle pour riders intermédiaires et avancés',
            specs: ['8m - 10m - 12m', 'Réactive', 'Excellent contrôle'],
            image: '/images/equipment/kite-cabrinha.jpg',
          },
          {
            name: 'North Rebel',
            description:
              'Aile haute performance pour le freestyle et le freeride',
            specs: ['7m - 9m - 11m', 'Explosive', 'Pop exceptionnel'],
            image: '/images/equipment/kite-north-rebel.jpg',
          },
        ],
      },
      {
        id: 'boards',
        name: 'Planches',
        icon: '🏄‍♂️',
        items: [
          {
            name: 'Planche Débutant',
            description: 'Large et stable, parfaite pour les premiers bords',
            specs: ['145cm x 45cm', 'Volume élevé', 'Très tolérante'],
            image: '/images/equipment/board-beginner.jpg',
          },
          {
            name: 'Planche Freestyle',
            description: 'Réactive et maniable pour les figures',
            specs: ['138cm x 42cm', 'Flex médium', 'Pads confortables'],
            image: '/images/equipment/board-freestyle.jpg',
          },
          {
            name: 'Planche Freeride',
            description: 'Polyvalente pour naviguer en toutes conditions',
            specs: ['140cm x 43cm', 'Confort optimal', 'Accroche parfaite'],
            image: '/images/equipment/board-freeride.jpg',
          },
        ],
      },
      {
        id: 'safety',
        name: 'Sécurité',
        icon: '🦺',
        items: [
          {
            name: 'Harnais Premium',
            description: 'Confort et sécurité pour des sessions prolongées',
            specs: [
              'Tailles XS à XXL',
              'Mousses haute densité',
              'Système de décrochage',
            ],
            image: '/images/equipment/harness.jpg',
          },
          {
            name: 'Casque Protection',
            description: 'Protection optimale certifiée CE',
            specs: ['Léger et ventilé', 'Ajustable', 'Absorption chocs'],
            image: '/images/equipment/helmet.jpg',
          },
          {
            name: 'Gilet Impact',
            description: 'Protection thoracique et flottabilité',
            specs: ['Néoprène 3mm', 'Zip frontal', 'Très souple'],
            image: '/images/equipment/impact-vest.jpg',
          },
        ],
      },
    ],
    maintenance: {
      title: 'Maintenance & Qualité',
      points: [
        "Vérification quotidienne de tout l'équipement",
        'Renouvellement régulier du matériel',
        'Nettoyage et désinfection après chaque utilisation',
        'Stockage optimal pour préserver la durée de vie',
      ],
    },
  },
  en: {
    title: 'Premium Equipment',
    subtitle: 'Latest generation gear for your safety',
    description:
      'We provide professional equipment regularly renewed, adapted to all levels and Dakhla conditions.',
    categories: [
      {
        id: 'kites',
        name: 'Kites',
        icon: '🪁',
        items: [
          {
            name: 'Duotone Evo',
            description: 'Versatile kite, ideal for learning and improvement',
            specs: ['9m - 12m - 14m', 'Very stable', 'Easy relaunch'],
            image: '/images/equipment/kite-duotone-evo.jpg',
          },
          {
            name: 'Cabrinha Switchblade',
            description:
              'Performance and control for intermediate and advanced riders',
            specs: ['8m - 10m - 12m', 'Responsive', 'Excellent control'],
            image: '/images/equipment/kite-cabrinha.jpg',
          },
          {
            name: 'North Rebel',
            description: 'High performance kite for freestyle and freeride',
            specs: ['7m - 9m - 11m', 'Explosive', 'Exceptional pop'],
            image: '/images/equipment/kite-north-rebel.jpg',
          },
        ],
      },
      {
        id: 'boards',
        name: 'Boards',
        icon: '🏄‍♂️',
        items: [
          {
            name: 'Beginner Board',
            description: 'Wide and stable, perfect for first rides',
            specs: ['145cm x 45cm', 'High volume', 'Very forgiving'],
            image: '/images/equipment/board-beginner.jpg',
          },
          {
            name: 'Freestyle Board',
            description: 'Responsive and agile for tricks',
            specs: ['138cm x 42cm', 'Medium flex', 'Comfortable pads'],
            image: '/images/equipment/board-freestyle.jpg',
          },
          {
            name: 'Freeride Board',
            description: 'Versatile for riding in all conditions',
            specs: ['140cm x 43cm', 'Optimal comfort', 'Perfect grip'],
            image: '/images/equipment/board-freeride.jpg',
          },
        ],
      },
      {
        id: 'safety',
        name: 'Safety',
        icon: '🦺',
        items: [
          {
            name: 'Premium Harness',
            description: 'Comfort and safety for extended sessions',
            specs: [
              'Sizes XS to XXL',
              'High density foam',
              'Quick release system',
            ],
            image: '/images/equipment/harness.jpg',
          },
          {
            name: 'Protection Helmet',
            description: 'Optimal CE certified protection',
            specs: ['Light and ventilated', 'Adjustable', 'Shock absorption'],
            image: '/images/equipment/helmet.jpg',
          },
          {
            name: 'Impact Vest',
            description: 'Chest protection and buoyancy',
            specs: ['3mm neoprene', 'Front zip', 'Very flexible'],
            image: '/images/equipment/impact-vest.jpg',
          },
        ],
      },
    ],
    maintenance: {
      title: 'Maintenance & Quality',
      points: [
        'Daily check of all equipment',
        'Regular gear renewal',
        'Cleaning and disinfection after each use',
        'Optimal storage to preserve lifespan',
      ],
    },
  },
};

export default function EquipmentSection({
  lang = 'fr',
  className = '',
}: EquipmentSectionProps) {
  const [activeCategory, setActiveCategory] = useState('kites');
  const t = content[lang];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section
      className={`py-16 md:py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 ${className}`}
    >
      <div className='container mx-auto px-4'>
        <motion.div
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4'>
              {t.title}
            </h2>
            <p className='text-xl md:text-2xl text-gray-600 mb-6 max-w-3xl mx-auto'>
              {t.subtitle}
            </p>
            <p className='text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed'>
              {t.description}
            </p>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            variants={itemVariants}
            className='flex justify-center mb-12'
          >
            <div className='flex flex-wrap gap-2 md:gap-4 bg-white rounded-2xl p-2 shadow-lg'>
              {t.categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span className='text-lg'>{category.icon}</span>
                  <span className='hidden sm:inline'>{category.name}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Equipment Grid */}
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeCategory}
              variants={containerVariants}
              initial='hidden'
              animate='visible'
              exit='hidden'
              className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16'
            >
              {t.categories
                .find(cat => cat.id === activeCategory)
                ?.items.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    className='bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group'
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    {/* Equipment Image Placeholder */}
                    <div className='h-48 bg-gradient-to-br from-blue-100 to-cyan-100 relative overflow-hidden'>
                      <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
                      <div className='absolute bottom-4 left-4 text-white font-bold text-lg'>
                        {item.name}
                      </div>
                      {/* Icon overlay */}
                      <div className='absolute top-4 right-4 text-3xl opacity-60'>
                        {
                          t.categories.find(cat => cat.id === activeCategory)
                            ?.icon
                        }
                      </div>
                    </div>

                    <div className='p-6'>
                      <h3 className='text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors'>
                        {item.name}
                      </h3>
                      <p className='text-gray-600 mb-4 leading-relaxed'>
                        {item.description}
                      </p>

                      {/* Specs */}
                      <div className='space-y-2'>
                        {item.specs.map((spec, specIndex) => (
                          <div
                            key={specIndex}
                            className='flex items-center gap-2 text-sm'
                          >
                            <div className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0' />
                            <span className='text-gray-700'>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          </AnimatePresence>

          {/* Maintenance Info */}
          <motion.div
            variants={itemVariants}
            className='bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto'
          >
            <h3 className='text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center'>
              {t.maintenance.title}
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {t.maintenance.points.map((point, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className='flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50 transition-colors'
                >
                  <div className='w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0'>
                    ✓
                  </div>
                  <p className='text-gray-700 leading-relaxed'>{point}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
