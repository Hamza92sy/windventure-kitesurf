// 🎯 PAGE TEST RÉSERVATION 4 PERSONNES - WINDVENTURE
'use client';

import React, { useState } from 'react';
import BookingComponent from '../../src/components/BookingComponent';
import StripeCheckout from '../../src/components/StripeCheckout';

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

export default function Booking4PersonsPage() {
  const [step, setStep] = useState<'booking' | 'checkout'>('booking');
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  const handleBookingChange = (data: BookingData) => {
    setBookingData(data);
  };

  const handleContinueToCheckout = () => {
    if (bookingData?.isValid) {
      setStep('checkout');
    }
  };

  const handleBackToBooking = () => {
    setStep('booking');
  };

  const checkoutData = bookingData ? {
    packageId: bookingData.packageId,
    personsCount: bookingData.personsCount,
    totalPrice: bookingData.totalPrice,
    startDate: bookingData.dates.startDate,
    endDate: bookingData.dates.endDate,
    customerInfo: {
      email: '',
      firstName: '',
      lastName: '',
      phone: ''
    }
  } : null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏄‍♂️ WindVenture - Packages 4 Personnes
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Nouvelle configuration optimisée - Prix transparent par personne
          </p>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className={`flex items-center ${step === 'booking' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full ${step === 'booking' ? 'bg-blue-600' : 'bg-gray-300'} text-white flex items-center justify-center text-sm font-bold`}>
                1
              </div>
              <span className="ml-2 font-medium">Sélection Package</span>
            </div>
            
            <div className="w-12 h-1 bg-gray-300"></div>
            
            <div className={`flex items-center ${step === 'checkout' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full ${step === 'checkout' ? 'bg-blue-600' : 'bg-gray-300'} text-white flex items-center justify-center text-sm font-bold`}>
                2
              </div>
              <span className="ml-2 font-medium">Paiement</span>
            </div>
          </div>
        </div>

        {/* Content */}
        {step === 'booking' && (
          <div>
            <BookingComponent onBookingChange={handleBookingChange} />
            
            {/* Continue Button */}
            {bookingData?.isValid && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleContinueToCheckout}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
                >
                  Continuer vers le paiement →
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'checkout' && checkoutData && (
          <div>
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={handleBackToBooking}
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Retour à la sélection
              </button>
            </div>

            <StripeCheckout 
              bookingData={checkoutData}
              onSuccess={(sessionId) => {
                console.log('✅ Paiement réussi:', sessionId);
                // Redirection automatique vers page success
              }}
              onError={(error) => {
                console.error('❌ Erreur paiement:', error);
                alert(`Erreur: ${error}`);
              }}
            />
          </div>
        )}

        {/* Debug Info (Dev Mode) */}
        {process.env.NODE_ENV === 'development' && bookingData && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">🔧 Debug Info (Dev Mode)</h3>
            <pre className="text-xs text-yellow-700 overflow-auto">
              {JSON.stringify(bookingData, null, 2)}
            </pre>
          </div>
        )}

        {/* Features List */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🚀 Nouvelles Fonctionnalités - Migration 4 Personnes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-green-800">✅ Business Optimisé</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Capacité max 4 personnes par package</li>
                <li>• Prix transparent par personne</li>
                <li>• Marges optimisées 692€-1830€</li>
                <li>• Calculs automatiques en temps réel</li>
                <li>• Validation business rules intégrée</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-blue-800">🎯 UX Améliorée</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Interface intuitive responsive</li>
                <li>• Sélection nombre personnes fluide</li>
                <li>• Calcul prix total automatique</li>
                <li>• Validation formulaire temps réel</li>
                <li>• Progression claire 2 étapes</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-purple-800">💳 Paiement Sécurisé</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Intégration Stripe optimisée</li>
                <li>• Métadonnées complètes webhook</li>
                <li>• Validation côté serveur robuste</li>
                <li>• Gestion erreurs avancée</li>
                <li>• URLs redirection configurables</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-orange-800">🔄 Automation Complète</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Sync Notion automatique</li>
                <li>• Emails confirmation Outlook</li>
                <li>• Calculs business intégrés</li>
                <li>• Retry logic pour webhooks</li>
                <li>• Monitoring et logging</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Migration Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-3">📊 Impact Migration 4 Personnes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-700">CA Potentiel:</span>
              <div className="text-blue-900">+60% vs 3 personnes</div>
            </div>
            <div>
              <span className="font-medium text-blue-700">Marge Nette:</span>
              <div className="text-blue-900">68k€-115k€/an</div>
            </div>
            <div>
              <span className="font-medium text-blue-700">Économie Client:</span>
              <div className="text-blue-900">300€ vs concurrence</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}