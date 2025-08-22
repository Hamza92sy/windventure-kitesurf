// 📄 PAGE CANCEL RÉSERVATION - WINDVENTURE 4 PERSONNES
'use client';

import { useEffect } from 'react';

export default function BookingCancel() {
  useEffect(() => {
    // Analytics pour tracking abandons
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'checkout_abandon', {
        event_category: 'booking',
        event_label: 'stripe_checkout_cancel'
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Cancel Icon */}
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🚫 Réservation Annulée
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Votre paiement a été annulé. Aucun montant n'a été débité.
          </p>

          {/* Reassurance */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3">💡 Pas de souci !</h3>
            <ul className="text-sm text-blue-700 space-y-2 text-left max-w-md mx-auto">
              <li>✅ Aucun paiement n'a été effectué</li>
              <li>✅ Vos informations sont sécurisées</li>
              <li>✅ Vous pouvez reprendre votre réservation</li>
              <li>✅ Vos sélections sont conservées temporairement</li>
            </ul>
          </div>

          {/* Reasons & Solutions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-yellow-800 mb-2">🤔 Pourquoi reprendre votre réservation ?</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
              <div>
                <strong>💰 Économies garanties</strong>
                <p>300€ d'économie vs packages avec restauration</p>
              </div>
              <div>
                <strong>🏄‍♂️ Expérience premium</strong>
                <p>Maximum 4 personnes pour un service exclusif</p>
              </div>
              <div>
                <strong>🎯 Prix transparents</strong>
                <p>Tarification claire par personne</p>
              </div>
              <div>
                <strong>🌟 Liberté totale</strong>
                <p>Découvrez Dakhla à votre rythme</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => window.location.href = '/booking-4persons'}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                ↻ Reprendre ma réservation
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">❓ Besoin d'aide ?</h4>
            <p className="text-sm text-gray-600 mb-4">
              Notre équipe est là pour vous accompagner dans votre réservation.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-blue-600 font-semibold">📧 Email</div>
                <a href="mailto:contact@windventure.fr" className="text-blue-600 hover:underline">
                  contact@windventure.fr
                </a>
              </div>
              <div className="text-center">
                <div className="text-blue-600 font-semibold">📱 Téléphone</div>
                <a href="tel:+33123456789" className="text-blue-600 hover:underline">
                  +33 1 23 45 67 89
                </a>
              </div>
              <div className="text-center">
                <div className="text-blue-600 font-semibold">💬 Chat</div>
                <span className="text-gray-600">Disponible 9h-18h</span>
              </div>
            </div>
          </div>

          {/* Alternative Options */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-3">🎯 Autres options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <a href="/packages" className="text-blue-600 hover:underline font-medium">
                  📋 Voir tous nos packages
                </a>
                <p className="text-gray-600">Comparez nos offres 4 personnes</p>
              </div>
              <div>
                <a href="/about" className="text-blue-600 hover:underline font-medium">
                  ℹ️ En savoir plus sur WindVenture
                </a>
                <p className="text-gray-600">Découvrez notre école à Dakhla</p>
              </div>
            </div>
          </div>
        </div>

        {/* Migration Info */}
        <div className="mt-8 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg p-6 text-center">
          <h3 className="font-bold text-lg mb-2">⚡ Nouveau : Packages 4 Personnes</h3>
          <p className="text-orange-100 text-sm">
            Testez notre système optimisé avec capacité étendue et prix transparents !
          </p>
        </div>
      </div>
    </div>
  );
}