# 🔧 RÉSOLUTION ERREUR NOTION DANS MAKE.COM

## ❌ ERREURS IDENTIFIÉES

```
1. Missing value of required parameter 'key' (x2)
2. Invalid date in parameter 'start'
```

## ✅ SOLUTION COMPLÈTE

### ÉTAPE 1 : VÉRIFIER LA CONNEXION NOTION

1. **Ouvrez le module Notion** dans votre scénario
2. **Cliquez sur "Connection"**
3. **Re-créez la connexion** :
   - Supprimez l'ancienne connexion
   - Cliquez "Add" → "Create a connection"
   - Nom : "WindVenture Notion V2"
   - Connectez-vous à Notion
   - **IMPORTANT** : Sélectionnez votre workspace WindVenture
   - Autorisez l'accès à la base "WindVenture - Réservations"

### ÉTAPE 2 : CORRIGER LE MAPPING DES CHAMPS

⚠️ **IMPORTANT** : Remappez TOUS les champs un par un

#### A. Champ Title (Client) - OBLIGATOIRE
```
Field: Client
Type: Title
Value: {{1.client}}
```

#### B. Champs Date - UTILISER parseDate()
```
Field: Date Arrivée
Type: Date
Value: {{parseDate(1.date_arrivee; "YYYY-MM-DD")}}

Field: Date Départ  
Type: Date
Value: {{parseDate(1.date_depart; "YYYY-MM-DD")}}

Field: Date Réservation
Type: Date
Value: {{now}}
```

#### C. Champs Select - VALEURS EXACTES
```
Field: Package
Type: Select
Value: {{switch(1.package; "beginner-private"; "Beginner Private"; "semi-private"; "Semi-Private"; "combined"; "Combined Package"; "exploration"; "Exploration Package"; 1.package)}}

Field: Niveau Kitesurf
Type: Select
Value: {{1.niveau_kitesurf}}

Field: Hébergement
Type: Select
Value: {{1.hebergement}}

Field: Statut Réservation
Type: Select
Value: {{ifempty(1.statut_reservation; "⏳ EN ATTENTE")}}

Field: Statut Paiement
Type: Select
Value: {{ifempty(1.statut_paiement; "En attente")}}
```

#### D. Champs Number
```
Field: Nb Personnes
Type: Number
Value: {{parseNumber(1.nb_personnes)}}

Field: Prix Total
Type: Number
Value: {{parseNumber(1.prix_total)}}

Field: Heures Formation
Type: Number
Value: {{parseNumber(1.heures_formation)}}

Field: Durée Séjour
Type: Number
Value: {{parseNumber(1.duree_sejour)}}
```

#### E. Champs Multi-Select (Services Extra)
```
Field: Services Extra
Type: Multi-select
Value: {{1.services_extra}}
```
⚠️ Si erreur, utilisez : `{{join(1.services_extra; ",")}}`

#### F. Autres champs
```
Field: Email
Type: Email
Value: {{1.email}}

Field: Téléphone
Type: Phone
Value: {{1.telephone}}

Field: Notes & Commentaires
Type: Text
Value: {{ifempty(1.notes_commentaires; "Aucune note")}}

Field: Source Réservation
Type: Select
Value: {{ifempty(1.source_reservation; "Site web")}}
```

### ÉTAPE 3 : AJOUTER UN MODULE DE VALIDATION (OPTIONNEL)

**Avant le module Notion**, ajoutez un module **"Tools" → "Set multiple variables"** :

```javascript
// Variables à définir
client_clean: {{ifempty(1.client; "Client sans nom")}}
date_arrivee_formatted: {{parseDate(1.date_arrivee; "YYYY-MM-DD")}}
date_depart_formatted: {{parseDate(1.date_depart; "YYYY-MM-DD")}}
nb_personnes_number: {{parseNumber(ifempty(1.nb_personnes; 1))}}
prix_total_number: {{parseNumber(ifempty(1.prix_total; 0))}}
```

Puis utilisez ces variables dans le module Notion.

### ÉTAPE 4 : AJOUTER UN ERROR HANDLER

1. **Clic droit** sur le module Notion
2. **Add error handler** → **Resume**
3. Configuration :
   - Number of attempts: 3
   - Interval between attempts: 10 seconds

### ÉTAPE 5 : TEST DE VALIDATION

Créez un nouveau fichier de test avec des données parfaitement formatées :