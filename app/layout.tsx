import React from 'react';
import './globals.css';

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
        url: 'https://windventure.fr/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'WindVenture Kitesurf Dakhla Morocco',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WindVenture - Ultimate Kitesurf Experience in Dakhla, Morocco',
    description: "Experience the magic of kitesurfing in Dakhla's legendary White Dune lagoon.",
    images: ['https://windventure.fr/images/twitter-card.jpg'],
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}