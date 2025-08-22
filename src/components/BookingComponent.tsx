// 🔧 FIX SÉLECTION PACKAGE DEPUIS URL - BOOKING COMPONENT
// Fichier : src/components/BookingComponent.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { optimizedPackages, packageUtils, businessMetrics } from '../data/packages-optimized';
import type { Package } from '../data/packages-optimized';

interface BookingComponentProps {
  selectedPackage?: Package;
  onBookingChange?: (bookingData: BookingData) => void;
}

interface BookingData {
  packageId: string;
  packageName: string;
  personsCount: number;
  pricePerPerson: number;
  totalPrice: number;
  marginNet: number;
  dates: {
    startDate: string;
    endDate: string;
  };
  isValid: boolean;
}

const BookingComponent: React.FC<BookingComponentProps> = ({ 
  selectedPackage, 
  onBookingChange 
}) => {
  const searchParams = useSearchParams();
  
  // 🎯 CORRECTION: Initialisation sans searchParams pour éviter erreurs SSR
  const getInitialPackageId = (): string => {
    // 1. Package fourni en props
    if (selectedPackage?.id && optimizedPackages.find(pkg => pkg.id === selectedPackage.id)) {
      console.log('📦 Package depuis props:', selectedPackage.id);
      return selectedPackage.id;
    }
    
    // 2. Package populaire par défaut (pas Beginner Private)
    const popularPackage = optimizedPackages.find(pkg => pkg.isPopular && pkg.category === 'group');
    if (popularPackage) {
      console.log('📦 Package populaire par défaut:', popularPackage.id);
      return popularPackage.id;
    }
    
    // 3. Premier package en dernier recours
    console.log('📦 Premier package par défaut:', optimizedPackages[0]?.id);
    return optimizedPackages[0]?.id || 'semi-private-discovery';
  };

  const [selectedPackageId, setSelectedPackageId] = useState<string>(getInitialPackageId());
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [personsCount, setPersonsCount] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  // Obtenir package sélectionné
  const currentPackage = optimizedPackages.find(pkg => pkg.id === selectedPackageId);

  // 🎯 CORRECTION: Initialisation et mise à jour depuis URL
  useEffect(() => {
    const urlPackageId = searchParams.get('package');
    
    // Première initialisation avec paramètre URL
    if (!isInitialized) {
      if (urlPackageId && optimizedPackages.find(pkg => pkg.id === urlPackageId)) {
        console.log('🔄 Initialisation avec URL package:', urlPackageId);
        setSelectedPackageId(urlPackageId);
      }
      setIsInitialized(true);
      return;
    }
    
    // Changements ultérieurs d'URL
    if (urlPackageId && optimizedPackages.find(pkg => pkg.id === urlPackageId)) {
      console.log('🔄 URL package changé:', urlPackageId);
      setSelectedPackageId(urlPackageId);
      
      // Réinitialiser nombre de personnes selon type package
      const pkg = optimizedPackages.find(p => p.id === urlPackageId);
      if (pkg?.category === 'private') {
        setPersonsCount(1);
      } else {
        setPersonsCount(2); // Valeur par défaut pour groupe
      }
    }
  }, [searchParams, isInitialized]);

  // 🎯 CORRECTION: Ajuster personnes selon package sélectionné (éviter boucles)
  useEffect(() => {
    if (currentPackage && isInitialized) {
      if (currentPackage.category === 'private' && personsCount !== 1) {
        setPersonsCount(1);
      } else if (currentPackage.category !== 'private' && personsCount > currentPackage.maxPersons) {
        setPersonsCount(Math.min(personsCount, currentPackage.maxPersons));
      }
    }
  }, [selectedPackageId, currentPackage, isInitialized]);

  // Calculer dates fin automatiquement
  useEffect(() => {
    if (startDate && currentPackage) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + (currentPackage?.durationDays || 0));
      setEndDate(end.toISOString().split('T')[0]);
    }
  }, [startDate, currentPackage]);

  // Mettre à jour données réservation
  useEffect(() => {
    if (currentPackage) {
      const totalPrice = packageUtils.calculateTotalPrice(selectedPackageId, personsCount);
      const marginNet = packageUtils.calculateNetMargin(selectedPackageId, personsCount);
      const isValid = packageUtils.validatePersonCount(selectedPackageId, personsCount) && 
                     startDate !== '' && 
                     endDate !== '';

      const newBookingData: BookingData = {
        packageId: selectedPackageId,
        packageName: currentPackage.name,
        personsCount,
        pricePerPerson: currentPackage.price,
        totalPrice,
        marginNet,
        dates: { startDate, endDate },
        isValid
      };

      setBookingData(newBookingData);
      onBookingChange?.(newBookingData);
    }
  }, [selectedPackageId, personsCount, startDate, endDate, currentPackage, onBookingChange]);

  // Gérer changement package
  const handlePackageChange = (newPackageId: string) => {
    console.log('📦 Changement package:', newPackageId);
    setSelectedPackageId(newPackageId);
    
    // Mettre à jour URL sans reload
    const url = new URL(window.location.href);
    url.searchParams.set('package', newPackageId);
    window.history.replaceState({}, '', url.toString());
  };

  // Gérer changement nombre de personnes
  const handlePersonsChange = (newCount: number) => {
    if (currentPackage) {
      const validCount = Math.max(1, Math.min(newCount, currentPackage.maxPersons));
      setPersonsCount(validCount);
    }
  };

  if (!currentPackage) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">❌ Package non trouvé</h3>
        <p className="text-red-600">Package ID: {selectedPackageId}</p>
        <p className="text-red-600">Packages disponibles: {optimizedPackages.map(p => p.id).join(', ')}</p>
      </div>
    );
  }

  const totalPrice = packageUtils.calculateTotalPrice(selectedPackageId, personsCount);
  const marginNet = packageUtils.calculateNetMargin(selectedPackageId, personsCount);
  const isPrivatePackage = currentPackage.category === 'private';

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      {/* Debug Info (Dev Mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <h4 className="font-semibold text-blue-800 mb-1">🔧 Debug Info</h4>
          <div className="text-sm text-blue-700">
            <div>URL Package: {searchParams.get('package')}</div>
            <div>Selected: {selectedPackageId}</div>
            <div>Package Found: {currentPackage ? '✅' : '❌'}</div>
            <div>Category: {currentPackage?.category}</div>
          </div>
        </div>
      )}

      {/* En-tête */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Réservation WindVenture
        </h2>
        <p className="text-gray-600">
          Capacité hébergement : Maximum {businessMetrics.maxCapacity} personnes
        </p>
      </div>

      {/* Sélection Package */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Package Sélectionné
        </label>
        <select
          value={selectedPackageId}
          onChange={(e) => handlePackageChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {optimizedPackages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.name} - {pkg.duration} - {pkg.price}€{pkg.category !== 'private' ? '/pers' : ''}
              {pkg.isPopular && ' ⭐ Populaire'}
              {pkg.isPremium && ' 💎 Premium'}
            </option>
          ))}
        </select>
        
        {/* Description package */}
        <div className="mt-3 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-700 mb-2">{currentPackage.shortDescription}</p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {currentPackage.duration}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Max {currentPackage.maxPersons} pers
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {currentPackage.category}
            </span>
          </div>
        </div>
      </div>

      {/* Nombre de Personnes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de Personnes
          {isPrivatePackage && (
            <span className="text-gray-500 text-xs ml-2">(Package privé - 1 personne)</span>
          )}
        </label>
        
        {isPrivatePackage ? (
          <div className="p-3 bg-gray-100 rounded-md text-gray-700">
            1 personne (cours privé exclusif)
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handlePersonsChange(personsCount - 1)}
              disabled={personsCount <= 1}
              className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
            >
              -
            </button>
            
            <div className="flex-1 text-center">
              <span className="text-2xl font-bold text-gray-900">{personsCount}</span>
              <span className="text-sm text-gray-500 block">
                {personsCount === 1 ? 'personne' : 'personnes'}
              </span>
            </div>
            
            <button
              onClick={() => handlePersonsChange(personsCount + 1)}
              disabled={personsCount >= currentPackage.maxPersons}
              className="w-10 h-10 rounded-full bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              +
            </button>
          </div>
        )}
        
        {/* Indicateur capacité */}
        {!isPrivatePackage && (
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>Min: 1 personne</span>
            <span>Max: {currentPackage.maxPersons} personnes</span>
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de Début
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de Fin
          </label>
          <input
            type="date"
            value={endDate}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
          />
          <p className="text-xs text-gray-500 mt-1">
            Calculé automatiquement ({currentPackage.durationDays} jours)
          </p>
        </div>
      </div>

      {/* Résumé Prix */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Résumé de Réservation</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Package:</span>
            <span className="font-medium">{currentPackage.name}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Durée:</span>
            <span className="font-medium">{currentPackage.duration}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">
              {isPrivatePackage ? 'Prix' : `Prix par personne`}:
            </span>
            <span className="font-medium">{currentPackage.price}€</span>
          </div>
          
          {!isPrivatePackage && (
            <div className="flex justify-between">
              <span className="text-gray-600">Nombre de personnes:</span>
              <span className="font-medium">{personsCount}</span>
            </div>
          )}
          
          <hr className="my-2" />
          
          <div className="flex justify-between text-lg font-bold">
            <span className="text-gray-900">Prix Total:</span>
            <span className="text-blue-600">{totalPrice.toLocaleString()}€</span>
          </div>

          {/* Économies vs concurrence */}
          <div className="text-sm text-green-600 mt-2">
            💰 Économie: ~300€ vs packages avec restauration
          </div>
        </div>
      </div>

      {/* Informations Business (Dev Mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-yellow-800 mb-2">📊 Métriques Business (Dev)</h4>
          <div className="text-sm space-y-1">
            <div>Marge nette estimée: <span className="font-bold text-green-600">{marginNet}€</span></div>
            <div>Coût instructeur (15%): <span className="text-orange-600">{Math.round(totalPrice * 0.15)}€</span></div>
            <div>Charges fixes {currentPackage.durationDays}j: <span className="text-red-600">{businessMetrics.dailyFixedCosts.total * currentPackage.durationDays}€</span></div>
          </div>
        </div>
      )}

      {/* Inclus dans le Package */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">✅ Inclus dans ce Package</h3>
        <ul className="space-y-2">
          {currentPackage.included.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-500 mr-2 mt-0.5">✓</span>
              <span className="text-gray-700 text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Validation et Erreurs */}
      {bookingData && !bookingData.isValid && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-red-800 mb-2">⚠️ Réservation Incomplète</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {!startDate && <li>• Veuillez sélectionner une date de début</li>}
            {personsCount < 1 && <li>• Minimum 1 personne requis</li>}
            {personsCount > currentPackage.maxPersons && (
              <li>• Maximum {currentPackage.maxPersons} personnes pour ce package</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BookingComponent;