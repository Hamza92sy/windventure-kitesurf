import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nos Packages | Windventure',
  description: 'Formules kite & séjours à Dakhla — cours, hébergement, transferts.',
  robots: { index: true, follow: true },
};

// Simple fallback packages page (alternative to the animated version)
export default function PackagesSimplePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
      
      <h1 className="text-4xl font-bold mb-6">Nos Packages</h1>
      <p className="mb-8 text-gray-600">
        Choisis la formule qui te convient : cours, hébergement, transferts, extras…
      </p>
      
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="packages-grid">
        {[
          { 
            name: 'Discover', 
            price: '€299', 
            desc: '2 jours, 2 sessions / jour, matériel inclus',
            href: '/packages/discover'
          },
          { 
            name: 'Progress', 
            price: '€699', 
            desc: '5 jours, 2 sessions / jour, downwinder',
            href: '/packages/progress'
          },
          { 
            name: 'Pro Camp', 
            price: '€1290', 
            desc: '7 jours, coaching avancé + boat session',
            href: '/packages/pro-camp'
          },
        ].map((p) => (
          <article key={p.name} className="rounded-2xl shadow border p-6 hover:shadow-lg transition-shadow" data-testid="package-card">
            <h2 className="text-xl font-medium mb-2">{p.name}</h2>
            <p className="text-3xl font-bold mb-3 text-blue-600">{p.price}</p>
            <p className="text-sm text-gray-600 mb-6">{p.desc}</p>
            <Link 
              href={p.href}
              className="inline-block rounded-xl px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Réserver
            </Link>
          </article>
        ))}
      </section>

      <div className="mt-16 text-center">
        <p className="text-gray-600 mb-6">
          Besoin d'aide pour choisir ? Contacte-nous pour des recommandations personnalisées.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors font-semibold"
        >
          Obtenir des conseils d'expert
        </Link>
      </div>
    </main>
  );
}