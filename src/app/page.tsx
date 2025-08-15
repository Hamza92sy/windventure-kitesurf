"use client"

import React from 'react';
import { Calendar, Star, MapPin, Wind, Users, Clock, ArrowRight, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

const WindVentureHomepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Wind className="h-8 w-8 text-cyan-600" />
              <span className="text-2xl font-bold text-gray-900">WindVenture</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#experiences" className="text-gray-700 hover:text-cyan-600 transition-colors">Expériences</a>
              <a href="#about" className="text-gray-700 hover:text-cyan-600 transition-colors">À Propos</a>
              <a href="#contact" className="text-gray-700 hover:text-cyan-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <MapPin className="h-5 w-5 text-red-500" />
              <span className="text-lg text-gray-600">Dakhla, Morocco 🇲🇦</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Libérez le <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Vent</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Découvrez les <span className="font-semibold text-cyan-600">meilleurs spots de kitesurf</span> à Dakhla avec nos guides experts. 
              Des sessions inoubliables dans le paradis du vent.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Réserver Maintenant</span>
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-cyan-600 hover:text-cyan-600 transition-all duration-300 flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Découvrir l'équipe</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-gray-600">Sessions</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-3xl font-bold text-gray-900">4.9</span>
                  <Star className="h-6 w-6 text-yellow-400 fill-current" />
                </div>
                <div className="text-gray-600">Avis clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">8</div>
                <div className="text-gray-600">Ans d'expérience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">94</div>
                <div className="text-gray-600">Riders actifs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conditions Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Conditions Parfaites</h3>
                <div className="flex items-center space-x-6 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Wind className="h-5 w-5 text-green-600" />
                    <span>Vent 15-25 knots</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <span>300 jours de vent par an</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-green-600">En Ligne</div>
                <div className="text-sm text-gray-600">Prochaine Session</div>
                <div className="text-lg font-bold text-gray-900">Dans 2h</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experiences Section */}
      <section id="experiences" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Expériences Kitesurf</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des cours personnalisés pour tous les niveaux, dans le spot mythique de Dakhla
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Beginner Package */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2"></div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Débutant</h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Populaire</span>
                </div>
                <p className="text-gray-600 mb-6">Parfait pour vos premiers pas dans le kitesurf</p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">3 heures de cours</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Instructeur certifié</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Wind className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Matériel inclus</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-6">450€</div>
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Réserver
                </button>
              </div>
            </div>

            {/* Intermediate Package */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2"></div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Intermédiaire</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">Recommandé</span>
                </div>
                <p className="text-gray-600 mb-6">Perfectionnez votre technique et votre style</p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">4 heures de cours</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Coaching avancé</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Wind className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Spots secrets</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-6">650€</div>
                <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Réserver
                </button>
              </div>
            </div>

            {/* Expert Package */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2"></div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Expert</h3>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">Premium</span>
                </div>
                <p className="text-gray-600 mb-6">Sessions pro avec les meilleurs instructeurs</p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Sessions illimitées</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Coach personnel</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Wind className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Matériel pro</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-6">890€</div>
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Réserver
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Prêt pour l'aventure ?</h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            Rejoignez plus de 500 riders qui ont découvert la magie du kitesurf à Dakhla
          </p>
          <button className="bg-white text-cyan-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto">
            <Calendar className="h-5 w-5" />
            <span>Réserver votre session</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Wind className="h-8 w-8 text-cyan-400" />
                <span className="text-2xl font-bold">WindVenture</span>
              </div>
              <p className="text-gray-400">
                L'école de kitesurf premium à Dakhla. Des sessions inoubliables dans le paradis du vent.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">Dakhla, Morocco</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">+212 XX XX XX XX</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">hello@windventure.fr</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Liens</h4>
              <div className="space-y-2">
                <a href="#experiences" className="block text-gray-400 hover:text-white transition-colors">Expériences</a>
                <a href="#about" className="block text-gray-400 hover:text-white transition-colors">À Propos</a>
                <a href="#contact" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 WindVenture. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WindVentureHomepage;