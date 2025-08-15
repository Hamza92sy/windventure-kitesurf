'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UXFeedback {
  id?: string;
  page: string;
  rating: number;
  comment: string;
  emoji: string;
  created_at?: string;
}

const emojis = ['😍', '😊', '😐', '😕', '😞'];

export default function UXNotes({ page = 'home' }: { page?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);

    try {
      const feedback: UXFeedback = {
        page,
        rating,
        comment,
        emoji: emojis[rating - 1],
      };

      const { error } = await supabase.from('ux_feedback').insert([feedback]);

      if (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      } else {
        setSubmitted(true);
        setTimeout(() => {
          setIsOpen(false);
          setSubmitted(false);
          setRating(0);
          setComment('');
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className='fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50'>
        <p className='text-sm'>Merci pour votre avis ! 😊</p>
      </div>
    );
  }

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(true)}
        className='fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-40 transition-all duration-200'
        aria-label='Donnez votre avis'
      >
        <span className='text-lg'>💬</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-semibold'>
                Votre avis nous intéresse !
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Rating */}
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Comment trouvez-vous cette page ?
                </label>
                <div className='flex space-x-2'>
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      type='button'
                      onClick={() => setRating(index + 1)}
                      className={`text-2xl p-2 rounded transition-all ${
                        rating === index + 1
                          ? 'bg-blue-100 scale-110'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Votre commentaire (optionnel)
                </label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className='w-full p-3 border border-gray-300 rounded-lg resize-none'
                  rows={3}
                  placeholder='Partagez votre expérience...'
                />
              </div>

              {/* Submit */}
              <button
                type='submit'
                disabled={rating === 0 || isSubmitting}
                className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg transition-colors'
              >
                {isSubmitting ? 'Envoi...' : 'Envoyer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
