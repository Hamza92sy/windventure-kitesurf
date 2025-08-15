'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const ClientPackages = dynamic(() => import('./PackagesContent'), {
  ssr: false,
  loading: () => (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
        <p className='text-gray-600'>Chargement des packages...</p>
      </div>
    </div>
  ),
});

export default function ClientPackagesWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Chargement...</p>
        </div>
      </div>
    );
  }

  return <ClientPackages />;
}
