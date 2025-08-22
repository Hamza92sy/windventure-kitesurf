// 💳 CHECKOUT STRIPE WINDVENTURE - PACKAGES 4 PERSONNES
'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { optimizedPackages, packageUtils } from '../data/packages-optimized';

// Initialiser Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutData {
  packageId: string;
  personsCount: number;
  totalPrice: number;
  startDate: string;
  endDate: string;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
}

interface StripeCheckoutProps {
  bookingData: CheckoutData;
  onSuccess?: (sessionId: string) => void;
  onError?: (error: string) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ 
  bookingData, 
  onSuccess, 
  onError 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const currentPackage = optimizedPackages.find(pkg => pkg.id === bookingData.packageId);

  if (!currentPackage) {
    return <div className="text-red-600">Package non trouvé</div>;
  }

  // Créer session checkout Stripe
  const createCheckoutSession = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Données package
          packageId: bookingData.packageId,
          packageName: currentPackage.name,
          stripePriceId: currentPackage.stripePriceId,
          
          // Quantité selon logique 4 personnes
          quantity: currentPackage.category === 'private' ? 1 : bookingData.personsCount,
          
          // Calculs business
          totalPrice: bookingData.totalPrice,
          pricePerPerson: currentPackage.price,
          personsCount: bookingData.personsCount,
          marginNet: packageUtils.calculateNetMargin(bookingData.packageId, bookingData.personsCount),
          
          // Dates séjour
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          duration: currentPackage.durationDays,
          
          // Client
          customerInfo: {
            ...customerInfo,
            email: customerInfo.email.toLowerCase().trim()
          },
          
          // Métadonnées pour Notion/Make.com
          metadata: {
            package_id: bookingData.packageId,
            package_category: currentPackage.category,
            persons_count: bookingData.personsCount.toString(),
            max_persons: currentPackage.maxPersons.toString(),
            start_date: bookingData.startDate,
            end_date: bookingData.endDate,
            duration_days: currentPackage.durationDays.toString(),
            total_price: bookingData.totalPrice.toString(),
            margin_net: packageUtils.calculateNetMargin(bookingData.packageId, bookingData.personsCount).toString(),
            business_model: 'optimized_4_persons',
            created_at: new Date().toISOString()
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur création session checkout');
      }

      const { sessionId } = await response.json();
      
      // Rediriger vers Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe non chargé');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw new Error(error.message);
      }

      onSuccess?.(sessionId);
      
    } catch (error) {
      console.error('Erreur checkout:', error);
      onError?.(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  // Validation formulaire
  const isFormValid = () => {
    return (
      customerInfo.email.includes('@') &&
      customerInfo.firstName.trim().length > 0 &&
      customerInfo.lastName.trim().length > 0 &&
      customerInfo.phone.trim().length > 0
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        💳 Finaliser la Réservation
      </h2>

      {/* Résumé Commande */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-3">📋 Résumé de Commande</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-700">Package:</span>
            <span className="font-medium text-blue-900">{currentPackage.name}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-blue-700">Durée:</span>
            <span className="font-medium text-blue-900">{currentPackage.duration}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-blue-700">Dates:</span>
            <span className="font-medium text-blue-900">
              {new Date(bookingData.startDate).toLocaleDateString('fr-FR')} → {' '}
              {new Date(bookingData.endDate).toLocaleDateString('fr-FR')}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-blue-700">
              {currentPackage.category === 'private' ? 'Service privé:' : 'Nombre de personnes:'}
            </span>
            <span className="font-medium text-blue-900">
              {bookingData.personsCount} {bookingData.personsCount === 1 ? 'personne' : 'personnes'}
            </span>
          </div>

          {currentPackage.category !== 'private' && (
            <div className="flex justify-between">
              <span className="text-blue-700">Prix par personne:</span>
              <span className="font-medium text-blue-900">{currentPackage.price}€</span>
            </div>
          )}
          
          <hr className="border-blue-200 my-2" />
          
          <div className="flex justify-between text-lg font-bold">
            <span className="text-blue-900">Total à payer:</span>
            <span className="text-blue-600">{bookingData.totalPrice.toLocaleString()}€</span>
          </div>

          <div className="text-xs text-green-600 mt-2">
            ✅ Économie ~300€ vs packages avec restauration obligatoire
          </div>
        </div>
      </div>

      {/* Formulaire Client */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">👤 Informations Client</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prénom *
            </label>
            <input
              type="text"
              value={customerInfo.firstName}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, firstName: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Votre prénom"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
              type="text"
              value={customerInfo.lastName}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, lastName: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Votre nom"
              required
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="votre.email@exemple.com"
            required
          />
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone *
          </label>
          <input
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+33 6 12 34 56 78"
            required
          />
        </div>
      </div>

      {/* Inclus Package */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">✅ Inclus dans ce Package</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <ul className="space-y-2">
            {currentPackage.included.slice(0, 5).map((item, index) => (
              <li key={index} className="flex items-start text-sm">
                <span className="text-green-500 mr-2 mt-0.5 flex-shrink-0">✓</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
            {currentPackage.included.length > 5 && (
              <li className="text-sm text-gray-500 italic">
                + {currentPackage.included.length - 5} autres services inclus...
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Garanties */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">🛡️ Nos Garanties</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>✅ Paiement sécurisé par Stripe</li>
          <li>✅ Confirmation immédiate par email</li>
          <li>✅ Annulation possible 48h avant (conditions)</li>
          <li>✅ Matériel premium garanti</li>
          <li>✅ Instructeurs certifiés IKO</li>
        </ul>
      </div>

      {/* Bouton Paiement */}
      <button
        onClick={createCheckoutSession}
        disabled={!isFormValid() || isLoading}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
          !isFormValid() || isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:transform active:scale-95'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
            Redirection vers paiement...
          </div>
        ) : (
          <>
            🔒 Payer {bookingData.totalPrice.toLocaleString()}€ par Stripe
          </>
        )}
      </button>

      {/* Informations Légales */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        En procédant au paiement, vous acceptez nos{' '}
        <a href="/terms" className="text-blue-600 hover:underline">conditions générales</a>
        {' '}et notre{' '}
        <a href="/privacy" className="text-blue-600 hover:underline">politique de confidentialité</a>.
        <br />
        Paiement sécurisé par Stripe. Aucune donnée bancaire n'est stockée sur nos serveurs.
      </div>
    </div>
  );
};

export default StripeCheckout;