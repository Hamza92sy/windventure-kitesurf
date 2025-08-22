// 📄 PAGE SUCCESS RÉSERVATION - WINDVENTURE 4 PERSONNES
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface SessionData {
  id: string;
  customer_email: string;
  amount_total: number;
  metadata: {
    package_name: string;
    persons_count: string;
    start_date: string;
    end_date: string;
    total_price: string;
  };
}

// Component pour gérer les paramètres de recherche
function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // En production, vous pourriez récupérer les détails via API
      // Pour l'instant, simulation avec données par défaut
      setTimeout(() => {
        setSessionData({
          id: sessionId,
          customer_email: 'client@example.com',
          amount_total: 1520, // Exemple: 4 × 380€
          metadata: {
            package_name: 'Semi-Private Discovery',
            persons_count: '4',
            start_date: '2025-03-15',
            end_date: '2025-03-18',
            total_price: '1520'
          }
        });
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre confirmation...</p>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Session invalide</h1>
            <p className="text-gray-600 mb-6">Aucune session de paiement trouvée.</p>
            <button 
              onClick={() => window.location.href = '/booking-4persons'}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Nouvelle réservation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Réservation Confirmée !
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Votre réservation WindVenture a été confirmée avec succès.
          </p>

          {/* Booking Details */}
          {sessionData && (
            <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-4">📋 Détails de votre réservation</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-700">Package:</span>
                  <span className="font-medium text-blue-900">{sessionData.metadata.package_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Personnes:</span>
                  <span className="font-medium text-blue-900">{sessionData.metadata.persons_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Dates:</span>
                  <span className="font-medium text-blue-900">
                    {new Date(sessionData.metadata.start_date).toLocaleDateString('fr-FR')} → {' '}
                    {new Date(sessionData.metadata.end_date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Prix total:</span>
                  <span className="font-bold text-blue-900">{sessionData.metadata.total_price}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Session ID:</span>
                  <span className="font-mono text-sm text-blue-900">{sessionData.id}</span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-green-800 mb-2">📧 Prochaines étapes</h4>
            <ul className="text-sm text-green-700 space-y-1 text-left">
              <li>✅ Email de confirmation envoyé automatiquement</li>
              <li>✅ Notre équipe vous contactera sous 24h</li>
              <li>✅ Informations détaillées et planning envoyés</li>
              <li>✅ Préparation matériel et spots optimaux</li>
              <li>✅ Instructions détaillées avant votre arrivée</li>
            </ul>
          </div>

          {/* Economic Advantage */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-yellow-800 mb-2">💰 Votre Avantage Économique</h4>
            <p className="text-sm text-yellow-700">
              Vous économisez <strong>~300€</strong> vs packages avec restauration obligatoire !
              <br />
              Profitez de cette liberté pour découvrir la gastronomie authentique de Dakhla.
            </p>
          </div>

          {/* Contact & Actions */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retour à l'accueil
              </button>
              
              <button 
                onClick={() => window.location.href = '/booking-4persons'}
                className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Nouvelle réservation
              </button>
            </div>
            
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                Questions ? Besoin d'aide ?
              </p>
              <div className="space-y-1 text-sm">
                <div>📧 <a href="mailto:contact@windventure.fr" className="text-blue-600 hover:underline">contact@windventure.fr</a></div>
                <div>📱 <a href="tel:+33123456789" className="text-blue-600 hover:underline">+33 1 23 45 67 89</a></div>
                <div>🌐 <a href="https://windventure.fr" className="text-blue-600 hover:underline">www.windventure.fr</a></div>
              </div>
            </div>
          </div>
        </div>

        {/* Migration Success Banner */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 text-center">
          <h3 className="font-bold text-lg mb-2">🚀 Migration 4 Personnes Réussie !</h3>
          <p className="text-blue-100 text-sm">
            Vous venez de tester notre nouveau système optimisé. 
            Capacité 4 personnes • Prix transparents • Marges optimisées
          </p>
        </div>
      </div>
    </div>
  );
}

// Composant de fallback pour le chargement
function BookingSuccessLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement de votre confirmation...</p>
      </div>
    </div>
  );
}

// Export principal avec Suspense
export default function BookingSuccess() {
  return (
    <Suspense fallback={<BookingSuccessLoading />}>
      <BookingSuccessContent />
    </Suspense>
  );
}