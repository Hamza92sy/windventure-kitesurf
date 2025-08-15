import React from 'react';
import HomePageWrapper from './page-wrapper';

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
  return <HomePageWrapper />;
}