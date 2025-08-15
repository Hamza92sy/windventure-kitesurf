'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavigationSimple from '../../components/NavigationSimple';
import FooterMinimal from '../../components/FooterMinimal';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What's the best time to visit Dakhla for kitesurfing?",
    answer:
      'Dakhla offers perfect conditions year-round, but the best months are April-October with consistent trade winds. Water temperature ranges from 18-24°C, making it comfortable even in winter.',
  },
  {
    question: 'Do I need previous experience to learn kitesurfing?',
    answer:
      'No previous experience is required! Our beginner courses are designed for complete newcomers. We start with land-based training covering safety, wind theory, and kite control before moving to the water.',
  },
  {
    question: 'How long does it take to learn kitesurfing?',
    answer:
      'Most students achieve independent riding within 6-12 hours of instruction spread over 3-5 days. Progress varies based on fitness, coordination, and weather conditions.',
  },
  {
    question: 'What should I bring for my lessons?',
    answer:
      'Just bring swimwear, sunscreen, sunglasses, and a towel. We provide all technical equipment including kites, boards, harnesses, wetsuits, and safety gear.',
  },
  {
    question: 'Are there age restrictions for kitesurfing?',
    answer:
      "Minimum age is 12 years with parental consent. There's no upper age limit, but participants must be in good physical condition and able to swim confidently.",
  },
  {
    question: 'What happens if weather conditions are poor?',
    answer:
      "Safety is our priority. If conditions are unsuitable, we'll reschedule your lesson at no extra cost. If rescheduling isn't possible, you'll receive a full refund.",
  },
  {
    question: 'Is kitesurfing dangerous?',
    answer:
      'When taught properly with modern equipment and safety protocols, kitesurfing is relatively safe. Our certified instructors prioritize safety education and use the latest safety systems.',
  },
  {
    question: "Can I rent equipment if I'm already experienced?",
    answer:
      "Yes! We offer equipment rental for certified riders. You'll need to demonstrate your skills and knowledge of safety procedures before renting.",
  },
  {
    question: 'How do I get to Dakhla?',
    answer:
      'Dakhla has its own airport (VIL) with regular flights from major Moroccan cities. We can arrange airport transfers and recommend accommodation partners.',
  },
  {
    question: "What's included in the lesson packages?",
    answer:
      'All packages include certified instruction, equipment (kite, board, harness, wetsuit), safety gear, and basic insurance. Advanced packages may include video analysis and certification.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-sky-100'>
      <NavigationSimple />

      <div className='pt-24 pb-12'>
        <div className='container mx-auto px-6 max-w-4xl'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-16'
          >
            <h1 className='text-4xl font-bold text-gray-900 mb-4'>
              Frequently Asked Questions
            </h1>
            <p className='text-lg text-gray-600'>
              Everything you need to know about kitesurfing in Dakhla
            </p>
          </motion.div>

          <div className='space-y-4'>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className='bg-white rounded-lg shadow-md overflow-hidden'
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className='w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors'
                >
                  <h3 className='font-semibold text-gray-900 pr-4'>
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                      openIndex === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className='px-6 pb-4'>
                        <p className='text-gray-600 leading-relaxed'>
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className='text-center mt-12 bg-blue-600 text-white rounded-lg p-8'
          >
            <h2 className='text-2xl font-bold mb-4'>Still have questions?</h2>
            <p className='mb-6'>
              Our team is here to help! Contact us directly for personalized
              answers.
            </p>
            <a
              href='/contact'
              className='inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </div>

      <FooterMinimal />
    </div>
  );
}
