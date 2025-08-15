'use client';

import React, { useState } from 'react';

const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simulation d'inscription
    setIsSubscribed(true);
    setEmail('');

    // Reset après 3 secondes
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <div className='w-full max-w-md'>
      <h3 className='text-lg font-semibold mb-4 text-white'>Restez informé</h3>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <input
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='Votre email'
          className='px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
          required
        />
        <button
          type='submit'
          className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors'
        >
          {isSubscribed ? 'Inscrit !' : "S'inscrire"}
        </button>
      </form>
    </div>
  );
};

export default NewsletterForm;
