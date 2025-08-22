import React from 'react';
import NotionBookingForm from '../components/NotionBookingForm';
import { Wind, Star, Shield, Clock, CheckCircle } from 'lucide-react';

export default function NotionReservationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Wind className="h-8 w-8 text-cyan-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">WindVenture</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">Accueil</a>
              <a href="/packages" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">Packages</a>
              <a href="/about" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">À propos</a>
              <a href="#contact" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
              <CheckCircle className="h-4 w-4" />
              <span className="font-semibold">Synchronisé avec Notion</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Réservez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Aventure Kitesurf</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Formulaire directement connecté à notre base de données Notion pour un traitement rapide
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="font-bold text-gray-900">4.9/5</div>
              <div className="text-sm text-gray-600">1000+ Avis</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="font-bold text-gray-900">IKO</div>
              <div className="text-sm text-gray-600">Certifié</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <Wind className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
              <div className="font-bold text-gray-900">300+</div>
              <div className="text-sm text-gray-600">Jours de vent</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="font-bold text-gray-900">24h</div>
              <div className="text-sm text-gray-600">Réponse rapide</div>
            </div>
          </div>

          {/* Formulaire */}
          <NotionBookingForm />

          {/* Informations supplémentaires */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comment ça marche ?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Remplissez le formulaire</h3>
                  <p className="text-gray-600">Choisissez votre package et vos dates préférées</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Synchronisation Notion</h3>
                  <p className="text-gray-600">Votre demande est automatiquement enregistrée dans notre système</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Confirmation rapide</h3>
                  <p className="text-gray-600">Nous vous contactons sous 24h avec tous les détails</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Préparez votre aventure !</h3>
                  <p className="text-gray-600">Recevez toutes les informations pour votre séjour à Dakhla</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ rapide */}
          <div className="mt-8 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8 max-w-4xl mx-auto text-white">
            <h3 className="text-2xl font-bold mb-4">Questions fréquentes</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Puis-je modifier ma réservation ?</h4>
                <p className="text-cyan-100">Oui, jusqu'à 7 jours avant votre arrivée sans frais.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Quel équipement est fourni ?</h4>
                <p className="text-cyan-100">Tout le matériel de kite (aile, planche, harnais, combinaison).</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Transferts inclus ?</h4>
                <p className="text-cyan-100">Transferts spot inclus. Aéroport en option.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Assurance comprise ?</h4>
                <p className="text-cyan-100">Oui, assurance RC et assistance incluses.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Wind className="h-8 w-8 text-cyan-400" />
              <span className="text-2xl font-bold">WindVenture</span>
            </div>
            <p className="text-gray-400 mb-4">
              Votre école de kitesurf premium à Dakhla, Maroc
            </p>
            <p className="text-gray-400">
              Contact : <a href="mailto:contact@windventure.fr" className="text-cyan-400 hover:underline">contact@windventure.fr</a>
            </p>
            <p className="text-gray-500 text-sm mt-4">
              © 2025 WindVenture Dakhla. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}