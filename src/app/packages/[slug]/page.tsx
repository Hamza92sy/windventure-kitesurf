import React from 'react';
import PackagePageClient from './PackagePageClient';

interface PackagePageProps {
  params: { slug: string };
}

export default function PackagePage({ params }: PackagePageProps) {
  return <PackagePageClient slug={params.slug} />;
}
