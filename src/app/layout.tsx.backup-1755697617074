// import { GoogleAnalytics } from '@next/third-parties/google';
import React from 'react';
import './globals.css';
// import { NextIntlClientProvider } from 'next-intl';
// import { getMessages } from 'next-intl/server';

export const metadata = {
  title: 'WindVenture - Ultimate Kitesurf Experience in Dakhla, Morocco',
  description:
    "Discover the world's best kitesurfing destination in Dakhla, Morocco. Perfect wind conditions 300+ days per year, crystal-clear lagoon waters, and expert instruction. Book your ultimate kitesurf adventure today!",
  keywords:
    'kitesurf Dakhla, kitesurfing Morocco, Dakhla kitesurf school, Morocco kitesurf lessons, White Dune Dakhla, kitesurf packages Morocco, Dakhla lagoon kitesurfing, best kitesurf destination',
  openGraph: {
    type: 'website',
    url: 'https://windventure.fr',
    title: 'WindVenture - Ultimate Kitesurf Experience in Dakhla, Morocco',
    description:
      "Experience the magic of kitesurfing in Dakhla's legendary White Dune lagoon. Perfect conditions, expert instruction, unforgettable adventure.",
    images: [
      {
        url: 'https://windventure.fr/images/hero/dakhla-lagoon-01.webp',
        width: 1200,
        height: 630,
        alt: 'Dakhla Lagoon Kitesurfing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WindVenture - Ultimate Kitesurf Experience in Dakhla, Morocco',
    description:
      "Experience the magic of kitesurfing in Dakhla's legendary White Dune lagoon.",
    images: ['https://windventure.fr/images/hero/dakhla-lagoon-01.webp'],
  },
  canonical: 'https://windventure.fr',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params?: {
    locale?: string;
  };
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const locale = params?.locale || 'fr';

  return (
    <html lang={locale}>
      <body className='font-sans'>
        <div id='skip-link'>
          <a
            href='#main-content'
            className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50'
          >
            Skip to main content
          </a>
        </div>
        <main id='main-content' role='main'>
          {children}
        </main>
        {/* <GoogleAnalytics gaId='G-XXXXXXXXXX' /> */}
      </body>
    </html>
  );
}
