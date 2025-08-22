# 📋 GUIDE DE CONFIGURATION MAKE.COM + NOTION WINDVENTURE

## 🎯 VUE D'ENSEMBLE

Ce guide vous explique comment configurer votre workflow Make.com pour synchroniser automatiquement les réservations WindVenture avec votre base Notion.

## 🔗 ARCHITECTURE DU SYSTÈME

```
[Site WindVenture] → [Webhook Make.com] → [Module Notion] → [Email Notification]
                                       ↓
                              [Base Notion WindVenture]
```

## 📊 STRUCTURE DE LA BASE NOTION WINDVENTURE

### Champs principaux de votre base :

| Champ Notion | Type | Description | Données webhook |
|--------------|------|-------------|-----------------|
| **Client** | Title | Nom complet | `client` |
| **Email** | Email | Email du client | `email` |
| **Téléphone** | Phone | Numéro avec indicatif | `telephone` |
| **Package** | Select | Type de package | `package` |
| **Date Arrivée** | Date | Date d'arrivée | `date_arrivee` |
| **Date Départ** | Date | Date de départ | `date_depart` |
| **Durée Séjour** | Number | Calculé auto | `duree_sejour` |
| **Nb Personnes** | Number | Nombre participants | `nb_personnes` |
| **Niveau Kitesurf** | Select | Niveau du client | `niveau_kitesurf` |
| **Hébergement** | Select | Type hébergement | `hebergement` |
| **Services Extra** | Multi-select | Services additionnels | `services_extra` |
| **Prix Total** | Number | Prix calculé | `prix_total` |
| **Heures Formation** | Number | Heures de cours | `heures_formation` |
| **Notes & Commentaires** | Text | Demandes spéciales | `notes_commentaires` |
| **Source Réservation** | Select | Origine | `source_reservation` |
| **Statut Réservation** | Select | État actuel | `statut_reservation` |
| **Statut Paiement** | Select | État paiement | `statut_paiement` |
| **Date Réservation** | Date | Date création | `date_reservation` |

## 🛠️ CONFIGURATION MAKE.COM

### ÉTAPE 1 : CRÉER LE SCÉNARIO

1. **Créer un nouveau scénario** dans Make.com
2. **Nommer** : "WindVenture - Réservations Notion"

### ÉTAPE 2 : MODULE WEBHOOK

1. **Ajouter module** : Webhooks > Custom webhook
2. **Configurer** :
   - Nom : "WindVenture Booking"
   - IP Restrictions : Aucune (ou liste blanche si besoin)

3. **Data Structure** - COPIEZ EXACTEMENT :
```json
{
  "client": "string",
  "email": "string",
  "telephone": "string",
  "package": "string",
  "date_arrivee": "string",
  "date_depart": "string",
  "duree_sejour": 0,
  "nb_personnes": 0,
  "niveau_kitesurf": "string",
  "hebergement": "string",
  "services_extra": [],
  "notes_commentaires": "string",
  "source_reservation": "string",
  "prix_total": 0,
  "heures_formation": 0,
  "statut_reservation": "string",
  "statut_paiement": "string",
  "date_reservation": "string"
}
```

4. **Copier l'URL du webhook** : `https://hook.eu2.make.com/[VOTRE_ID]`

### ÉTAPE 3 : MODULE NOTION

1. **Ajouter module** : Notion > Create a Database Item

2. **Connexion** :
   - Cliquer "Add" pour créer une connexion
   - Se connecter à Notion
   - Autoriser l'accès à votre workspace

3. **Configuration** :
   - **Database** : Sélectionner "WindVenture - Réservations"
   - **Mapping des champs** :

| Champ Notion | Valeur Make.com |
|--------------|-----------------|
| Client | `{{1.client}}` |
| Email | `{{1.email}}` |
| Téléphone | `{{1.telephone}}` |
| Package | `{{1.package}}` |
| Date Arrivée | `{{parseDate(1.date_arrivee; "YYYY-MM-DD")}}` |
| Date Départ | `{{parseDate(1.date_depart; "YYYY-MM-DD")}}` |
| Durée Séjour | `{{1.duree_sejour}}` |
| Nb Personnes | `{{1.nb_personnes}}` |
| Niveau Kitesurf | `{{1.niveau_kitesurf}}` |
| Hébergement | `{{1.hebergement}}` |
| Services Extra | `{{1.services_extra}}` |
| Prix Total | `{{1.prix_total}}` |
| Heures Formation | `{{1.heures_formation}}` |
| Notes & Commentaires | `{{1.notes_commentaires}}` |
| Source Réservation | `{{1.source_reservation}}` |
| Statut Réservation | `{{1.statut_reservation}}` |
| Statut Paiement | `{{1.statut_paiement}}` |
| Date Réservation | `{{now}}` |

### ÉTAPE 4 : MODULE EMAIL (NOTIFICATION)

1. **Ajouter module** : Email > Send an Email

2. **Configuration** :
   - **To** : `votre-email@windventure.fr`
   - **Subject** : `🎯 Nouvelle réservation: {{1.client}} - {{1.package}}`
   
3. **Body HTML** :
```html
<h2>Nouvelle Réservation WindVenture</h2>

<h3>👤 Client</h3>
<ul>
  <li><strong>Nom:</strong> {{1.client}}</li>
  <li><strong>Email:</strong> {{1.email}}</li>
  <li><strong>Téléphone:</strong> {{1.telephone}}</li>
</ul>

<h3>📅 Séjour</h3>
<ul>
  <li><strong>Package:</strong> {{1.package}}</li>
  <li><strong>Arrivée:</strong> {{1.date_arrivee}}</li>
  <li><strong>Départ:</strong> {{1.date_depart}}</li>
  <li><strong>Durée:</strong> {{1.duree_sejour}} jours</li>
  <li><strong>Personnes:</strong> {{1.nb_personnes}}</li>
</ul>

<h3>💰 Tarification</h3>
<ul>
  <li><strong>Prix Total:</strong> {{1.prix_total}}€</li>
  <li><strong>Heures Formation:</strong> {{1.heures_formation}}h</li>
</ul>

<h3>📝 Détails</h3>
<ul>
  <li><strong>Niveau:</strong> {{1.niveau_kitesurf}}</li>
  <li><strong>Hébergement:</strong> {{1.hebergement}}</li>
  <li><strong>Services Extra:</strong> {{join(1.services_extra; ", ")}}</li>
  <li><strong>Notes:</strong> {{1.notes_commentaires}}</li>
</ul>

<p><a href="https://notion.so/[VOTRE_LIEN_BASE]">Voir dans Notion</a></p>
```

### ÉTAPE 5 : FILTRES ET ROUTEURS (OPTIONNEL)

#### Router pour différents types de packages :
1. **Ajouter Router** après le webhook
2. **Branches** :
   - Branch 1 : Packages standards
   - Branch 2 : Demandes custom
   - Branch 3 : Groupes (>4 personnes)

#### Filtres par package :
```
Branch 1: {{1.package}} = "beginner-private" OR {{1.package}} = "semi-private"
Branch 2: {{1.notes_commentaires}} contains "sur mesure"
Branch 3: {{1.nb_personnes}} > 4
```

## 🧪 TESTS

### Test avec le script fourni :
```bash
# Test simple
node scripts/test-notion-webhook.js

# Tous les tests
node scripts/test-notion-webhook.js --all

# Voir la structure
node scripts/test-notion-webhook.js --struct
```

### Test manuel dans Make.com :
1. Cliquer "Run once" sur le scénario
2. Envoyer une requête test
3. Vérifier l'exécution dans l'historique

## 📱 INTÉGRATION SITE WEB

### Utiliser le nouveau formulaire :
```html
<!-- Dans votre site Next.js -->
<a href="/notion-reservation">Réserver maintenant</a>
```

### URL de la page :
- **Local** : `http://localhost:3000/notion-reservation`
- **Production** : `https://windventure.fr/notion-reservation`

## 🔍 DÉBOGAGE

### Problèmes fréquents :

| Problème | Solution |
|----------|----------|
| Webhook ne reçoit rien | Vérifier que le scénario est ON |
| Notion ne créé pas l'entrée | Vérifier la connexion Notion |
| Champs manquants | Re-mapper les champs dans Make |
| Email non reçu | Vérifier spam + config SMTP |
| Erreur 400 | Structure de données incorrecte |

### Logs utiles :
- **Make.com** : History > Execution details
- **Browser** : Console (F12) pour voir les erreurs JS
- **Notion** : Activity log de la base

## 📈 OPTIMISATIONS AVANCÉES

### 1. Calculs automatiques dans Make :
```javascript
// Prix total
{{1.nb_personnes * switch(1.package; "beginner-private"; 720; "semi-private"; 1100; "combined"; 1350; "exploration"; 1250; 0)}}

// Durée en jours
{{floor((parseDate(1.date_depart; "YYYY-MM-DD") - parseDate(1.date_arrivee; "YYYY-MM-DD")) / 86400000)}}
```

### 2. Webhooks multiples :
- Webhook 1 : Réservations standards
- Webhook 2 : Demandes custom
- Webhook 3 : Partenaires B2B

### 3. Intégrations supplémentaires :
- **Slack** : Notification instantanée
- **Google Sheets** : Backup des données
- **Calendly** : Sync calendrier
- **Stripe** : Paiement automatique

## 🚀 MISE EN PRODUCTION

### Checklist finale :
- [ ] Webhook URL dans variables d'environnement
- [ ] Scénario Make.com activé
- [ ] Connexion Notion vérifiée
- [ ] Email notifications configuré
- [ ] Tests complets effectués
- [ ] Monitoring activé
- [ ] Documentation équipe à jour

## 📞 SUPPORT

**Problème Make.com ?**
- Documentation : https://www.make.com/help
- Support : support@make.com

**Problème Notion ?**
- API Docs : https://developers.notion.com
- Help Center : https://notion.so/help

**Problème WindVenture ?**
- Email : contact@windventure.fr
- Code source : `/app/components/NotionBookingForm.tsx`

---

✅ **Configuration terminée !** Votre système de réservation est maintenant synchronisé avec Notion.