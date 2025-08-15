import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found | Windventure',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center">
        <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Page non trouvée</h1>
        <p className="text-gray-600 mb-8">
          Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour à l'accueil
          </Link>
          <div>
            <Link
              href="/packages"
              className="inline-block px-6 py-3 text-blue-600 hover:text-blue-800 transition-colors"
            >
              Voir nos packages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}