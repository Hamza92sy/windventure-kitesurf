// 🔧 CORRECTION AFFICHAGE PRIX - COMPOSANTS PACKAGES
// Fichier à créer/remplacer : src/components/PackageCard.tsx

import React from 'react';
import Link from 'next/link';
import { optimizedPackages } from '@/data/packages-optimized';
import type { Package } from '@/data/packages-optimized';

interface PackageCardProps {
  pkg?: Package;
  package?: Package;
  showPerPersonPricing?: boolean;
  categoryColors?: Record<string, string>;
  categoryIcons?: Record<string, string>;
  className?: string;
  onClick?: () => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ 
  pkg,
  package: packageProp,
  showPerPersonPricing = true,
  categoryColors,
  categoryIcons,
  className = '',
  onClick
}) => {
  // Utiliser package fourni ou premier package optimisé
  const currentPkg = pkg || packageProp || optimizedPackages[0];

  // Guard clause pour package manquant
  if (!currentPkg) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Package non trouvé</p>
      </div>
    );
  }

  // Calculer prix affichage selon type
  const isPrivatePackage = currentPkg.category === 'private';
  const displayPrice = currentPkg.price;
  const maxRevenue = isPrivatePackage ? currentPkg.price : (currentPkg.price * currentPkg.maxPersons);

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {/* Badge Populaire/Premium */}
      {(currentPkg.isPopular || currentPkg.isPremium) && (
        <div className="relative">
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold z-10 ${
            currentPkg.isPremium 
              ? 'bg-purple-500 text-white' 
              : 'bg-orange-500 text-white'
          }`}>
            {currentPkg.isPremium ? '💎 PREMIUM' : '⭐ POPULAIRE'}
          </div>
        </div>
      )}

      {/* Contenu Principal */}
      <div className="p-6">
        {/* En-tête Package */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {currentPkg.name}
          </h3>
          <p className="text-gray-600 text-sm">
            {currentPkg.shortDescription}
          </p>
        </div>

        {/* Pricing Section - NOUVEAUX PRIX 4 PERSONNES */}
        <div className="mb-6">
          <div className="flex items-end gap-2 mb-2">
            {/* Prix Principal */}
            <span className="text-3xl font-bold text-blue-600">
              {displayPrice.toLocaleString()}€
            </span>
            
            {/* Par Personne ou Prix Fixe */}
            <span className="text-gray-500 text-sm mb-1">
              {isPrivatePackage ? '(privé)' : '/personne'}
            </span>
          </div>

          {/* Détails Capacité */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {currentPkg.duration}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {isPrivatePackage ? '1 personne' : `Max ${currentPkg.maxPersons} pers`}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 capitalize">
              {currentPkg.category}
            </span>
          </div>

          {/* Calcul Groupe Complet */}
          {!isPrivatePackage && (
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Groupe complet ({currentPkg.maxPersons} pers):</span>
                <span className="font-semibold text-gray-900">
                  {maxRevenue.toLocaleString()}€ total
                </span>
              </div>
              <div className="text-xs text-green-600 mt-1">
                💰 Économie ~300€ vs packages pension complète
              </div>
            </div>
          )}

          {/* Comparaison Concurrence */}
          {!isPrivatePackage && (
            <div className="text-xs text-gray-500">
              <span className="line-through text-red-500">
                {(maxRevenue + 300).toLocaleString()}€
              </span>
              <span className="text-green-600 font-medium ml-2">
                vs concurrence avec restauration
              </span>
            </div>
          )}
        </div>

        {/* Services Inclus */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">✅ Inclus</h4>
          <ul className="space-y-1">
            {currentPkg.included.slice(0, 4).map((item, index) => (
              <li key={index} className="flex items-start text-sm">
                <span className="text-green-500 mr-2 mt-0.5 flex-shrink-0">✓</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
            {currentPkg.included.length > 4 && (
              <li className="text-sm text-gray-500 italic">
                + {currentPkg.included.length - 4} autres services...
              </li>
            )}
          </ul>
        </div>

        {/* Bouton Réservation */}
        <Link 
          href={`/booking-4persons?package=${currentPkg.id}`}
          className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-center"
          onClick={onClick}
        >
          Réserver - {displayPrice}€{!isPrivatePackage ? '/pers' : ''}
        </Link>

        {/* Note Transparence */}
        <div className="mt-3 text-xs text-center text-gray-500">
          Prix transparent • Sans frais cachés • Paiement sécurisé
        </div>
      </div>
    </div>
  );
};

// Composant Liste Packages avec Nouveaux Prix
export const PackagesList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {optimizedPackages.map((pkg) => (
        <PackageCard key={pkg.id} pkg={pkg} />
      ))}
    </div>
  );
};

// Export composants avec prix forcés pour debug
export const DebugPricing: React.FC = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h3 className="font-bold text-yellow-800 mb-2">🔧 Debug - Nouveaux Prix 4 Personnes</h3>
      <div className="space-y-1 text-sm">
        {optimizedPackages.map((pkg) => (
          <div key={pkg.id} className="flex justify-between">
            <span className="text-yellow-700">{pkg.name}:</span>
            <span className="font-medium text-yellow-900">
              {pkg.price}€{pkg.category !== 'private' ? `/pers (max ${pkg.maxPersons})` : ' (privé)'}
            </span>
          </div>
        ))}
      </div>
      <div className="text-xs text-yellow-600 mt-2">
        Si vous voyez ces prix, la migration 4 personnes fonctionne ✅
      </div>
    </div>
  );
};

export default PackageCard;