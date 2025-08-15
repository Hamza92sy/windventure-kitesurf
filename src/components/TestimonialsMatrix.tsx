'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';

const testimonials = [
  {
    id: 1,
    name: 'Alex Chen',
    role: 'Professional Kitesurfer',
    avatar: '/images/dakhla/dakhla-lagoon-2.jpg',
    content:
      'Dakhla Matrix is absolutely mind-blowing! The wind conditions are perfect 300+ days a year. This place is pure magic for kitesurfing.',
    rating: 5,
    location: 'California, USA',
  },
  {
    id: 2,
    name: 'Sarah Müller',
    role: 'Beginner Kitesurfer',
    avatar: '/images/dakhla/white-dune-1.jpg',
    content:
      'As a beginner, I was worried about the conditions, but the instructors here are incredible. I learned more in one week than in months elsewhere.',
    rating: 5,
    location: 'Berlin, Germany',
  },
  {
    id: 3,
    name: 'Marco Rossi',
    role: 'Adventure Photographer',
    avatar: '/images/dakhla/white-dune-2.jpg',
    content:
      "The combination of desert and ocean creates the most unique kitesurfing experience. The Matrix atmosphere here is unlike anything I've ever seen.",
    rating: 5,
    location: 'Milan, Italy',
  },
  {
    id: 4,
    name: 'Emma Thompson',
    role: 'Freestyle Rider',
    avatar: '/images/dakhla/dakhla-lagoon-1.jpg',
    content:
      'Perfect flat water for freestyle tricks, consistent wind, and the most beautiful sunsets. Dakhla Matrix is my new favorite spot!',
    rating: 5,
    location: 'London, UK',
  },
];

const TestimonialsMatrix: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      prev => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextTestimonial,
    onSwipedRight: prevTestimonial,
    trackMouse: true,
  });

  return (
    <section className='relative py-20 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden'>
      {/* Background Pattern */}
      <div className='absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30'></div>

      <div className='container mx-auto px-4 relative z-10'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            <span className='bg-gradient-to-r from-cyan-400 via-purple-500 to-magenta-500 bg-clip-text text-transparent'>
              Matrix Testimonials
            </span>
          </h2>
          <p className='text-xl text-cyan-400/80 max-w-2xl mx-auto'>
            Hear from our riders who experienced the digital realm of Dakhla
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className='max-w-4xl mx-auto'>
          <div {...swipeHandlers} className='relative'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className='relative'
              >
                <div className='bg-black/30 backdrop-blur-xl rounded-2xl border border-cyan-400/20 p-8 md:p-12'>
                  {/* Quote Icon */}
                  <div className='absolute top-6 right-6 text-cyan-400/30'>
                    <Quote size={48} />
                  </div>

                  {/* Content */}
                  <div className='flex flex-col md:flex-row items-center md:items-start gap-8'>
                    {/* Avatar */}
                    <div className='relative'>
                      <div className='w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-cyan-400/50'>
                        <div className='w-full h-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center'>
                          <span className='text-white font-bold text-lg'>
                            {testimonials[currentIndex]?.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center'>
                        <Star className='w-3 h-3 text-black fill-current' />
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className='flex-1 text-center md:text-left'>
                      <p className='text-lg md:text-xl text-white/90 mb-6 leading-relaxed'>
                        &quot;{testimonials[currentIndex]?.content}&quot;
                      </p>

                      {/* Rating */}
                      <div className='flex justify-center md:justify-start gap-1 mb-4'>
                        {[
                          ...Array(testimonials[currentIndex]?.rating || 5),
                        ].map((_, i) => (
                          <Star
                            key={i}
                            className='w-5 h-5 text-cyan-400 fill-current'
                          />
                        ))}
                      </div>

                      {/* Author Info */}
                      <div>
                        <h4 className='text-xl font-bold text-cyan-400 mb-1'>
                          {testimonials[currentIndex]?.name}
                        </h4>
                        <p className='text-white/70 mb-1'>
                          {testimonials[currentIndex]?.role}
                        </p>
                        <p className='text-cyan-400/60 text-sm'>
                          {testimonials[currentIndex]?.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <motion.button
              onClick={prevTestimonial}
              className='absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 p-3 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-cyan-500/30 hover:scale-110 transition-all duration-300 border border-cyan-400/30 hover:border-cyan-400'
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.95 }}
              aria-label='Previous testimonial'
            >
              <ChevronLeft size={24} />
            </motion.button>

            <motion.button
              onClick={nextTestimonial}
              className='absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 p-3 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-cyan-500/30 hover:scale-110 transition-all duration-300 border border-cyan-400/30 hover:border-cyan-400'
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.95 }}
              aria-label='Next testimonial'
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>

          {/* Indicators */}
          <div className='flex justify-center mt-8 space-x-3'>
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-cyan-400 to-purple-500 shadow-lg shadow-cyan-400/50'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to testimonial ${index + 1}`}
              >
                {index === currentIndex && (
                  <motion.div
                    className='absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500'
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsMatrix;
