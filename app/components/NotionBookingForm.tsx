"use client"

import React, { useState } from 'react';
import { Calendar, Users, Mail, User, Phone, Home, Package, MessageSquare, AlertCircle, Plane, Bed } from 'lucide-react';

interface NotionFormData {
  name: string;
  email: string;
  phone: string;
  package: string;
  checkin: string;
  checkout: string;
  participants: number;
  level: string;
  accommodation: string;
  services: string[];
  notes: string;
  source: string;
}

const PACKAGES_PRIX = {
  'beginner-private': { nom: 'Beginner Private (6h)', prix: 720, heures: 6 },
  'semi-private': { nom: 'Semi-Private (8h)', prix: 1100, heures: 8 },
  'combined': { nom: 'Combined Package (12h)', prix: 1350, heures: 12 },
  'exploration': { nom: 'Exploration Package (10h)', prix: 1250, heures: 10 }
};

const SERVICES_DISPONIBLES = [
  'Transfert aéroport',
  'Location matériel premium',
  'Photographe professionnel',
  'Excursion Dune Blanche',
  'Cours yoga/stretching',
  'Repas sur site'
];

export default function NotionBookingForm() {
  const [formData, setFormData] = useState<NotionFormData>({
    name: '',
    email: '',
    phone: '',
    package: '',
    checkin: '',
    checkout: '',
    participants: 1,
    level: 'Débutant',
    accommodation: '',
    services: [],
    notes: '',
    source: 'Site web'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const calculatePrixTotal = () => {
    if (!formData.package) return 0;
    const packageInfo = PACKAGES_PRIX[formData.package as keyof typeof PACKAGES_PRIX];
    if (!packageInfo) return 0;
    return packageInfo.prix * formData.participants;
  };

  const calculateDuree = () => {
    if (!formData.checkin || !formData.checkout) return 0;
    const arrivee = new Date(formData.checkin);
    const depart = new Date(formData.checkout);
    const diff = depart.getTime() - arrivee.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Données adaptées pour Make.com/Notion
    const packageInfo = PACKAGES_PRIX[formData.package as keyof typeof PACKAGES_PRIX];
    const webhookData = {
      // Variables exactes attendues par Make.com
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      package: formData.package,
      checkin: formData.checkin,
      checkout: formData.checkout,
      participants: formData.participants,
      level: formData.level,
      accommodation: formData.accommodation,
      services: formData.services,
      notes: formData.notes,
      source: formData.source,
      
      // Données calculées (optionnelles pour Notion)
      price_total: calculatePrixTotal(),
      duration: calculateDuree(),
      training_hours: packageInfo?.heures || 0,
      booking_date: new Date().toISOString().split('T')[0] // Format YYYY-MM-DD
    };

    try {
      // Envoi direct au webhook Make.com
      const response = await fetch('https://hook.eu2.make.com/bfncwe5cc93t2g8d22pw1ao60g5v2rcl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          window.location.href = '/booking-confirmation';
        }, 1500);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Réservez Votre Aventure Kitesurf</h2>
          <p className="text-gray-600">Formulaire synchronisé avec notre base Notion</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section Informations Client */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-cyan-600" />
              Informations Personnelles
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom Complet *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="jean@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline-block w-4 h-4 mr-1" />
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau Kitesurf *
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="Débutant">Débutant - Jamais pratiqué</option>
                  <option value="Initié">Initié - Quelques sessions</option>
                  <option value="Intermédiaire">Intermédiaire - Navigation autonome</option>
                  <option value="Confirmé">Confirmé - Freestyle/Vagues</option>
                  <option value="Expert">Expert - Compétition</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section Package et Dates */}
          <div className="bg-cyan-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-cyan-600" />
              Package et Dates
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sélectionnez votre Package *
                </label>
                <select
                  name="package"
                  value={formData.package}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">-- Choisir un package --</option>
                  {Object.entries(PACKAGES_PRIX).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.nom} - {info.prix}€/pers ({info.heures}h de cours)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  Date d'arrivée *
                </label>
                <input
                  type="date"
                  name="checkin"
                  value={formData.checkin}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  Date de départ *
                </label>
                <input
                  type="date"
                  name="checkout"
                  value={formData.checkout}
                  onChange={handleInputChange}
                  required
                  min={formData.checkin || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline-block w-4 h-4 mr-1" />
                  Nombre de personnes *
                </label>
                <input
                  type="number"
                  name="participants"
                  value={formData.participants}
                  onChange={handleInputChange}
                  min="1"
                  max="8"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Bed className="inline-block w-4 h-4 mr-1" />
                  Hébergement *
                </label>
                <select
                  name="accommodation"
                  value={formData.accommodation}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">-- Choisir --</option>
                  <option value="Hôtel partenaire">Hôtel partenaire (recommandé)</option>
                  <option value="Location Airbnb">Location Airbnb</option>
                  <option value="Camping">Camping</option>
                  <option value="Déjà réservé">J'ai déjà mon hébergement</option>
                  <option value="Besoin conseil">J'ai besoin de conseils</option>
                </select>
              </div>
            </div>

            {/* Affichage du prix */}
            {formData.package && (
              <div className="mt-6 p-4 bg-white rounded-lg border-2 border-cyan-500">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">Prix Total Estimé:</span>
                  <span className="text-2xl font-bold text-cyan-600">
                    {calculatePrixTotal()}€
                  </span>
                </div>
                {calculateDuree() > 0 && (
                  <div className="text-sm text-gray-600 mt-1">
                    Pour {calculateDuree()} jours - {formData.participants} personne(s)
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section Services Extra */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Plane className="w-5 h-5 mr-2 text-blue-600" />
              Services Supplémentaires (optionnel)
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {SERVICES_DISPONIBLES.map((service) => (
                <label key={service} className="flex items-center space-x-3 cursor-pointer hover:bg-white p-3 rounded-lg transition">
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                    className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                  />
                  <span className="text-gray-700">{service}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section Commentaires */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="inline-block w-4 h-4 mr-1" />
              Notes & Commentaires
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Informations supplémentaires, demandes spéciales, questions..."
            />
          </div>

          {/* Messages de statut */}
          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Réservation envoyée avec succès ! Redirection...
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Erreur lors de l'envoi. Contactez-nous à contact@windventure.fr
            </div>
          )}

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-lg transform hover:scale-105'
            }`}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Confirmer la Réservation'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Besoin d'aide ? Email : <a href="mailto:contact@windventure.fr" className="text-cyan-600 hover:underline">contact@windventure.fr</a></p>
        </div>
      </div>
    </div>
  );
}