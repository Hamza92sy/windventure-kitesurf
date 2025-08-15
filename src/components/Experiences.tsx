'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  TruckIcon,
  BuildingStorefrontIcon,
  FireIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';

const Experiences = () => {
  const [activeExperience, setActiveExperience] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const experiences = [
    {
      id: 1,
      title: 'Desert Safari 4x4',
      subtitle: 'Adventure into the Sahara',
      description:
        'Explore the endless dunes of the Sahara Desert in our specially equipped 4x4 vehicles. Discover hidden oases, ancient nomad camps, and witness breathtaking sunset views over the golden sand.',
      image:
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
      icon: TruckIcon,
      duration: 'Half Day (4h)',
      groupSize: '2-8 people',
      difficulty: 'Easy',
      highlights: [
        'Professional desert guide',
        'Traditional tea ceremony',
        'Sunset photography spots',
        'Visit to nomad camps',
        'Sandboarding opportunity',
      ],
      price: '€89',
      included: [
        '4x4 transport',
        'Desert guide',
        'Traditional tea',
        'Equipment',
      ],
      gallery: [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=400',
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=400',
        'https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=400',
      ],
    },
    {
      id: 2,
      title: 'Lagoon Boat Trip',
      subtitle: 'Discover the protected waters',
      description:
        "Navigate through Dakhla's pristine lagoon aboard our traditional fishing boats. Spot flamingos, dolphins, and enjoy fresh seafood while exploring hidden beaches and coral reefs.",
      image:
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3',
      icon: BuildingStorefrontIcon,
      duration: 'Full Day (8h)',
      groupSize: '4-12 people',
      difficulty: 'Easy',
      highlights: [
        'Traditional fishing boat',
        'Wildlife spotting (dolphins, flamingos)',
        'Fresh seafood lunch',
        'Secret beach visits',
        'Snorkeling equipment',
      ],
      price: '€129',
      included: [
        'Boat transport',
        'Captain & guide',
        'Seafood lunch',
        'Snorkel gear',
      ],
      gallery: [
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=400',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400',
      ],
    },
    {
      id: 3,
      title: 'Desert Bivouac',
      subtitle: 'Sleep under the stars',
      description:
        'Experience the magic of the Sahara with an overnight desert camp. Enjoy traditional Berber dinner, stargazing sessions, and wake up to spectacular sunrise views over the dunes.',
      image:
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3',
      icon: FireIcon,
      duration: 'Overnight (24h)',
      groupSize: '2-16 people',
      difficulty: 'Moderate',
      highlights: [
        'Traditional Berber tent',
        'Campfire & traditional music',
        'Stargazing with telescope',
        'Sunrise camel ride',
        'Authentic Berber cuisine',
      ],
      price: '€199',
      included: [
        'Desert camp',
        'All meals',
        'Bedding',
        'Activities',
        'Transport',
      ],
      gallery: [
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=400',
        'https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=400',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=400',
      ],
    },
  ];

  const currentExp = experiences[activeExperience];

  return (
    <section id='experiences' className='experiences-section' ref={ref}>
      <div className='windventure-container'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className='windventure-title windventure-title--section'>
            Beyond Kitesurfing
          </h2>
          <p className='windventure-subtitle max-w-3xl mx-auto'>
            Dakhla offers incredible adventures beyond the waves. Explore the
            Sahara Desert, discover marine wildlife, and immerse yourself in
            authentic Berber culture.
          </p>
        </motion.div>

        <div className='experiences-container'>
          {/* Experience Selector */}
          <motion.div
            className='experiences-selector'
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {experiences.map((exp, index) => (
              <button
                key={exp.id}
                className={`experiences-selector-item ${index === activeExperience ? 'active' : ''}`}
                onClick={() => setActiveExperience(index)}
              >
                <div className='experiences-selector-icon'>
                  <exp.icon className='w-6 h-6' />
                </div>
                <div className='experiences-selector-text'>
                  <h3>{exp.title}</h3>
                  <p>{exp.subtitle}</p>
                </div>
                <div className='experiences-selector-price'>{exp.price}</div>
              </button>
            ))}
          </motion.div>

          {/* Main Experience Display */}
          <motion.div
            className='experiences-main'
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeExperience}
                className='experiences-content'
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
              >
                {/* Main Image */}
                <div className='experiences-image-container'>
                  <div
                    className='experiences-image'
                    style={{ backgroundImage: `url('${currentExp.image}')` }}
                  >
                    <div className='experiences-image-overlay' />
                    <div className='experiences-badge'>
                      <currentExp.icon className='w-5 h-5' />
                      <span>{currentExp.title}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className='experiences-details'>
                  <div className='experiences-header'>
                    <h3 className='experiences-title'>{currentExp.title}</h3>
                    <p className='experiences-subtitle'>
                      {currentExp.subtitle}
                    </p>
                    <div className='experiences-price-main'>
                      {currentExp.price}
                    </div>
                  </div>

                  <p className='experiences-description'>
                    {currentExp.description}
                  </p>

                  {/* Info Grid */}
                  <div className='experiences-info-grid'>
                    <div className='experiences-info-item'>
                      <ClockIcon className='w-5 h-5' />
                      <div>
                        <span className='label'>Duration</span>
                        <span className='value'>{currentExp.duration}</span>
                      </div>
                    </div>
                    <div className='experiences-info-item'>
                      <UserGroupIcon className='w-5 h-5' />
                      <div>
                        <span className='label'>Group Size</span>
                        <span className='value'>{currentExp.groupSize}</span>
                      </div>
                    </div>
                    <div className='experiences-info-item'>
                      <StarIcon className='w-5 h-5' />
                      <div>
                        <span className='label'>Difficulty</span>
                        <span className='value'>{currentExp.difficulty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className='experiences-highlights'>
                    <h4>Experience Highlights</h4>
                    <ul>
                      {currentExp.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Gallery */}
                  <div className='experiences-gallery'>
                    <h4>Gallery</h4>
                    <div className='experiences-gallery-grid'>
                      {currentExp.gallery.map((image, index) => (
                        <div
                          key={index}
                          className='experiences-gallery-item'
                          style={{ backgroundImage: `url('${image}')` }}
                        >
                          <CameraIcon className='experiences-gallery-icon w-5 h-5' />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className='experiences-cta'>
                    <motion.button
                      className='windventure-btn windventure-btn--primary'
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Book This Experience
                      <MapPinIcon className='w-5 h-5' />
                    </motion.button>
                    <span className='experiences-included'>
                      Includes: {currentExp.included.join(', ')}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .experiences-section {
          padding: 6rem 0;
          background: var(--desert-white);
        }

        .experiences-container {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 3rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .experiences-selector {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .experiences-selector-item {
          background: white;
          border: 2px solid transparent;
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          cursor: pointer;
          transition: all var(--transition-smooth);
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: left;
        }

        .experiences-selector-item:hover,
        .experiences-selector-item.active {
          border-color: var(--dakhla-turquoise);
          box-shadow: var(--shadow-lg);
          transform: translateY(-2px);
        }

        .experiences-selector-icon {
          width: 50px;
          height: 50px;
          background: var(--gradient-ocean);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .experiences-selector-text {
          flex: 1;
        }

        .experiences-selector-text h3 {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          color: var(--dakhla-ocean-deep);
          margin-bottom: 0.25rem;
        }

        .experiences-selector-text p {
          font-size: 0.9rem;
          color: var(--stone-dark);
        }

        .experiences-selector-price {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--dakhla-turquoise);
        }

        .experiences-main {
          background: white;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-xl);
        }

        .experiences-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 600px;
        }

        .experiences-image-container {
          position: relative;
          overflow: hidden;
        }

        .experiences-image {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          position: relative;
        }

        .experiences-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(30, 58, 138, 0.2) 0%,
            rgba(64, 224, 208, 0.1) 100%
          );
        }

        .experiences-badge {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: var(--radius-full);
          padding: 0.75rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--dakhla-ocean-deep);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .experiences-details {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .experiences-header {
          position: relative;
        }

        .experiences-title {
          font-family: var(--font-serif);
          font-size: 2rem;
          color: var(--dakhla-ocean-deep);
          margin-bottom: 0.5rem;
        }

        .experiences-subtitle {
          color: var(--dakhla-turquoise);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.9rem;
        }

        .experiences-price-main {
          position: absolute;
          top: 0;
          right: 0;
          font-family: var(--font-serif);
          font-size: 2.5rem;
          color: var(--dakhla-turquoise);
          font-weight: 400;
        }

        .experiences-description {
          color: var(--stone-dark);
          line-height: 1.7;
          font-size: 1.05rem;
        }

        .experiences-info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .experiences-info-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: var(--dune-light);
          border-radius: var(--radius-md);
        }

        .experiences-info-item svg {
          color: var(--dakhla-turquoise);
          flex-shrink: 0;
        }

        .experiences-info-item .label {
          display: block;
          font-size: 0.8rem;
          color: var(--stone-dark);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .experiences-info-item .value {
          display: block;
          font-weight: 600;
          color: var(--charcoal);
        }

        .experiences-highlights h4,
        .experiences-gallery h4 {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--dakhla-ocean-deep);
          margin-bottom: 0.75rem;
        }

        .experiences-highlights ul {
          list-style: none;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .experiences-highlights li {
          position: relative;
          padding-left: 1.5rem;
          color: var(--stone-dark);
          font-size: 0.95rem;
        }

        .experiences-highlights li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--dakhla-turquoise);
          font-weight: 600;
        }

        .experiences-gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }

        .experiences-gallery-item {
          height: 80px;
          background-size: cover;
          background-position: center;
          border-radius: var(--radius-md);
          position: relative;
          cursor: pointer;
          transition: transform var(--transition-smooth);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .experiences-gallery-item:hover {
          transform: scale(1.05);
        }

        .experiences-gallery-icon {
          color: white;
          opacity: 0;
          transition: opacity var(--transition-smooth);
        }

        .experiences-gallery-item:hover .experiences-gallery-icon {
          opacity: 1;
        }

        .experiences-cta {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .experiences-included {
          font-size: 0.9rem;
          color: var(--stone-dark);
          font-style: italic;
        }

        @media (max-width: 1024px) {
          .experiences-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .experiences-selector {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 1rem;
          }

          .experiences-selector-item {
            min-width: 280px;
          }

          .experiences-content {
            grid-template-columns: 1fr;
          }

          .experiences-image-container {
            height: 300px;
          }

          .experiences-details {
            padding: 2rem;
          }
        }

        @media (max-width: 768px) {
          .experiences-details {
            padding: 1.5rem;
          }

          .experiences-title {
            font-size: 1.5rem;
          }

          .experiences-price-main {
            font-size: 2rem;
          }

          .experiences-info-grid {
            grid-template-columns: 1fr;
          }

          .experiences-highlights ul {
            grid-template-columns: 1fr;
          }

          .experiences-gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </section>
  );
};

export default Experiences;
