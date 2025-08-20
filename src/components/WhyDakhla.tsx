'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  CloudIcon,
  SunIcon,
  GlobeAltIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const WhyDakhla = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const features = [
    {
      icon: CloudIcon,
      title: 'Constant Trade Winds',
      subtitle: '300+ wind days per year',
      description:
        "Dakhla's unique position creates consistent thermal winds, perfect for kitesurfing year-round.",
      image:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    },
    {
      icon: SunIcon,
      title: 'Perfect Climate',
      subtitle: '25°C average temperature',
      description:
        'Enjoy endless sunshine and comfortable temperatures, making every session unforgettable.',
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3',
    },
    {
      icon: GlobeAltIcon,
      title: 'Protected Lagoon',
      subtitle: 'Flat water paradise',
      description:
        'The shallow, warm lagoon offers perfect conditions for beginners and freestylers alike.',
      image:
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3',
    },
    {
      icon: SparklesIcon,
      title: 'Sahara Magic',
      subtitle: 'Desert meets ocean',
      description:
        'Experience the unique beauty where golden dunes meet turquoise waters.',
      image:
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3',
    },
  ];

  return (
    <section id='why-dakhla' className='windventure-section' ref={ref}>
      <div className='windventure-container'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className='windventure-title windventure-title--section'>
            Why Dakhla?
          </h2>
          <p className='windventure-subtitle max-w-3xl mx-auto'>
            Nestled on Morocco&apos;s Atlantic coast, Dakhla is a kitesurfing
            paradise where the Sahara Desert creates perfect wind conditions and
            endless adventures await.
          </p>
        </motion.div>

        <div className='why-dakhla-grid'>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className='why-dakhla-card'
              initial={{ opacity: 0, y: 80 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
                ease: 'easeOut',
              }}
            >
              <div className='why-dakhla-card__content'>
                <div className='why-dakhla-card__icon'>
{React.createElement(feature.icon as any, { className: 'w-8 h-8' })}
                </div>

                <div className='why-dakhla-card__text'>
                  <h3 className='why-dakhla-card__title'>{feature.title}</h3>
                  <p className='why-dakhla-card__subtitle'>
                    {feature.subtitle}
                  </p>
                  <p className='why-dakhla-card__description'>
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className='why-dakhla-card__image-container'>
                <div
                  className='why-dakhla-card__image'
                  style={{ backgroundImage: `url('${feature.image}')` }}
                >
                  <div className='why-dakhla-card__image-overlay' />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Statistics Section */}
        <motion.div
          className='why-dakhla-stats'
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className='why-dakhla-stats__container'>
            <div className='why-dakhla-stat'>
              <div className='why-dakhla-stat__number'>25+ knots</div>
              <div className='why-dakhla-stat__label'>Average Wind Speed</div>
            </div>
            <div className='why-dakhla-stat'>
              <div className='why-dakhla-stat__number'>12 months</div>
              <div className='why-dakhla-stat__label'>Kiting Season</div>
            </div>
            <div className='why-dakhla-stat'>
              <div className='why-dakhla-stat__number'>40 km²</div>
              <div className='why-dakhla-stat__label'>Lagoon Size</div>
            </div>
            <div className='why-dakhla-stat'>
              <div className='why-dakhla-stat__number'>0.5m</div>
              <div className='why-dakhla-stat__label'>Average Depth</div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .why-dakhla-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .why-dakhla-card {
          background: white;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          transition: all var(--transition-smooth);
          height: 400px;
          display: flex;
          flex-direction: column;
        }

        .why-dakhla-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
        }

        .why-dakhla-card__content {
          padding: 2rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 2;
          background: white;
        }

        .why-dakhla-card__icon {
          width: 60px;
          height: 60px;
          background: var(--gradient-ocean);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 1.5rem;
          box-shadow: var(--shadow-md);
        }

        .why-dakhla-card__text {
          flex: 1;
        }

        .why-dakhla-card__title {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          color: var(--dakhla-ocean-deep);
          margin-bottom: 0.5rem;
        }

        .why-dakhla-card__subtitle {
          color: var(--dakhla-turquoise);
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }

        .why-dakhla-card__description {
          color: var(--stone-dark);
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .why-dakhla-card__image-container {
          height: 160px;
          position: relative;
          overflow: hidden;
        }

        .why-dakhla-card__image {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transition: transform var(--transition-slow);
        }

        .why-dakhla-card:hover .why-dakhla-card__image {
          transform: scale(1.1);
        }

        .why-dakhla-card__image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(30, 58, 138, 0.1) 100%
          );
        }

        .why-dakhla-stats {
          padding: 3rem 0;
          background: var(--gradient-desert);
          border-radius: var(--radius-xl);
          margin-top: 2rem;
        }

        .why-dakhla-stats__container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .why-dakhla-stat {
          text-align: center;
          padding: 1rem;
        }

        .why-dakhla-stat__number {
          font-family: var(--font-serif);
          font-size: 2.5rem;
          color: var(--dakhla-ocean-deep);
          font-weight: 400;
          margin-bottom: 0.5rem;
          display: block;
        }

        .why-dakhla-stat__label {
          color: var(--stone-dark);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .why-dakhla-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .why-dakhla-card {
            height: auto;
            min-height: 350px;
          }

          .why-dakhla-card__content {
            padding: 1.5rem;
          }

          .why-dakhla-card__image-container {
            height: 140px;
          }

          .why-dakhla-stats__container {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }

          .why-dakhla-stat__number {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  );
};

export default WhyDakhla;
