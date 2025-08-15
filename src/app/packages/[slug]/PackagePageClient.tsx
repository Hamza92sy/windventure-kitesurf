'use client';

import React from 'react';
import PremiumPackagePage from './PremiumPackagePage';

interface PackagePageClientProps {
  slug: string;
}

function PackagePageClient({ slug }: PackagePageClientProps) {
  return <PremiumPackagePage slug={slug} />;
}

export default PackagePageClient;
