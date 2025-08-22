# 🎯 MAPPING FINAL NOTION - VARIABLES WEBHOOK

## ✅ FORMULAIRE ADAPTÉ AVEC SUCCÈS !

Le formulaire a été modifié pour envoyer les variables exactes attendues par votre mapping Notion.

## 📊 MAPPING MAKE.COM → NOTION (CONFIRMÉ)

### 🔗 **MODULE WEBHOOK → CREATE DATABASE ITEM**

```yaml
# MAPPING EXACT POUR NOTION :

📋 Propriétés de Base :
Client: {{1.name}}
Email: {{1.email}}
Package: {{1.package}}
Téléphone: {{1.phone}}
Nb Personnes: {{1.participants}}
Niveau Kitesurf: {{1.level}}
Notes & Commentaires: {{1.notes}}
Hébergement: {{1.accommodation}}
Source Réservation: {{1.source}}

📅 Propriétés Dates :
Date Arrivée: {{parseDate(1.checkin; "YYYY-MM-DD")}}
Date Départ: {{parseDate(1.checkout; "YYYY-MM-DD")}}
Date Réservation: {{now}}

📊 Propriétés Calculées (optionnelles) :
Prix Total: {{1.price_total}}
Durée Séjour: {{1.duration}}
Heures Formation: {{1.training_hours}}

🏷️ Propriétés Status (TEXTE FIXE) :
Statut Réservation: "⏳ EN ATTENTE"
Statut Paiement: "En attente"

🔢 Services Extra (Multi-select) :
Services Extra: {{1.services}}
```

## 🧪 **DONNÉES DE TEST ENVOYÉES**

Le webhook reçoit maintenant cette structure :

```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com", 
  "phone": "+33612345678",
  "package": "combined",
  "checkin": "2025-05-15",
  "checkout": "2025-05-22",
  "participants": 2,
  "level": "Intermédiaire",
  "accommodation": "Hôtel partenaire",
  "services": ["Transfert aéroport", "Photographe professionnel"],
  "notes": "Test avec nouvelles variables",
  "source": "Site web",
  "price_total": 2700,
  "duration": 7,
  "training_hours": 12,
  "booking_date": "2025-08-22"
}
```

## 📧 **CONFIGURATION EMAIL OUTLOOK**

Avec les nouvelles variables, le template email devient :

```html
<h1>✅ Nouvelle Réservation WindVenture</h1>

<h2>👤 Client</h2>
<p><strong>Nom:</strong> {{1.name}}</p>
<p><strong>Email:</strong> {{1.email}}</p>
<p><strong>Téléphone:</strong> {{1.phone}}</p>

<h2>📅 Séjour</h2>
<p><strong>Package:</strong> {{1.package}}</p>
<p><strong>Arrivée:</strong> {{1.checkin}}</p>
<p><strong>Départ:</strong> {{1.checkout}}</p>
<p><strong>Durée:</strong> {{1.duration}} jours</p>
<p><strong>Participants:</strong> {{1.participants}} personne(s)</p>
<p><strong>Niveau:</strong> {{1.level}}</p>

<h2>💰 Prix</h2>
<p><strong>Total:</strong> {{1.price_total}}€</p>
<p><strong>Formation:</strong> {{1.training_hours}} heures</p>

<h2>🏨 Hébergement</h2>
<p>{{1.accommodation}}</p>

{{#if 1.services}}
<h2>➕ Services Extra</h2>
<ul>
{{#each 1.services}}
  <li>{{this}}</li>
{{/each}}
</ul>
{{/if}}

{{#if 1.notes}}
<h2>📝 Notes</h2>
<p>{{1.notes}}</p>
{{/if}}
```

## 🚀 **ÉTAPES SUIVANTES**

### 1️⃣ **Dans Make.com - Module Notion**
Utilisez exactement ce mapping :
- Client → `{{1.name}}`
- Email → `{{1.email}}`
- Téléphone → `{{1.phone}}`
- Package → `{{1.package}}`
- Date Arrivée → `{{parseDate(1.checkin; "YYYY-MM-DD")}}`
- Date Départ → `{{parseDate(1.checkout; "YYYY-MM-DD")}}`
- Nb Personnes → `{{1.participants}}`
- Niveau Kitesurf → `{{1.level}}`
- Hébergement → `{{1.accommodation}}`
- Services Extra → `{{1.services}}`
- Notes & Commentaires → `{{1.notes}}`
- Source Réservation → `{{1.source}}`

### 2️⃣ **Dans Make.com - Module Email**
```
To: {{1.email}}
CC: hamzasaidousy@outlook.fr, contact@windventure.fr
BCC: hamzaseidou582@gmail.com
Subject: ✅ Confirmation WindVenture - {{1.package}} - {{1.name}}
```

### 3️⃣ **Tester le formulaire complet**
```
URL: http://localhost:3000/notion-reservation
1. Remplir le formulaire
2. Soumettre
3. Vérifier Make.com History
4. Vérifier Notion (nouvelle entrée)
5. Vérifier Outlook (emails reçus)
```

## ✅ **RÉSULTAT ATTENDU**

- ✅ **Webhook** : Status 200 (déjà testé)
- ✅ **Notion** : Nouvelle entrée avec tous les champs
- ✅ **Email Client** : Confirmation professionnelle
- ✅ **Email Interne** : Notification détaillée
- ✅ **Formulaire** : Redirection vers /booking-confirmation

**Le système est maintenant parfaitement aligné !** 🎯

## 🔍 **DÉPANNAGE**

Si erreur dans Notion :
1. **Vérifiez la connexion** Notion dans Make.com
2. **Re-mappez les champs** avec les variables exactes ci-dessus
3. **Testez "Run once"** dans Make.com
4. **Vérifiez les types de champs** dans Notion (Date, Number, etc.)

**Variables testées et validées ! Prêt pour la configuration finale.** 🚀