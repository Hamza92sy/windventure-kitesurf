# 📧 CONFIGURATION OUTLOOK DANS MAKE.COM

## 🎯 OBJECTIF
Configurer l'envoi d'emails de notification via Outlook dans votre workflow Make.com pour les réservations WindVenture.

## 📍 PRÉREQUIS
- ✅ Webhook Make.com configuré et fonctionnel
- ✅ Module Notion configuré
- ✅ Compte Outlook (Outlook.com, Hotmail ou Office 365)

## 🔧 OPTION 1 : MODULE MICROSOFT OUTLOOK (RECOMMANDÉ)

### Étape 1 : Ajouter le module
1. Dans votre scénario Make.com, après le module Notion
2. Cliquez sur **+** → Rechercher **"Microsoft Outlook"**
3. Sélectionnez **"Send an Email"**

### Étape 2 : Créer la connexion
1. Cliquez sur **"Add"** dans Connection
2. **Nom** : "WindVenture Outlook"
3. Cliquez **"Save"**
4. **Fenêtre Microsoft** : Connectez-vous avec vos identifiants Outlook
5. **Autorisez** Make.com à accéder à votre compte

### Étape 3 : Configuration du module

**Champs à remplir :**

```
To: {{1.email}}
CC: votre-email-copie@windventure.fr (optionnel)
Subject: 🎯 Nouvelle réservation WindVenture - {{1.client}}
Body Type: HTML
Importance: Normal
```

**Body (HTML) - Copiez ce template :**

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #00b4d8, #0077b6);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
        }
        .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .info-block {
            background: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .info-block h3 {
            color: #0077b6;
            margin-top: 0;
            border-bottom: 2px solid #00b4d8;
            padding-bottom: 10px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .label {
            font-weight: 600;
            color: #555;
        }
        .value {
            color: #333;
        }
        .price-block {
            background: linear-gradient(135deg, #48bb78, #38a169);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
        }
        .price {
            font-size: 36px;
            font-weight: bold;
        }
        .action-block {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
        }
        .services-list {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏄‍♂️ Nouvelle Réservation WindVenture</h1>
            <p>{{formatDate(now; "DD/MM/YYYY HH:mm")}}</p>
        </div>
        
        <div class="content">
            <!-- Informations Client -->
            <div class="info-block">
                <h3>👤 Informations Client</h3>
                <div class="info-row">
                    <span class="label">Nom:</span>
                    <span class="value">{{1.client}}</span>
                </div>
                <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value"><a href="mailto:{{1.email}}">{{1.email}}</a></span>
                </div>
                <div class="info-row">
                    <span class="label">Téléphone:</span>
                    <span class="value">{{1.telephone}}</span>
                </div>
                <div class="info-row">
                    <span class="label">Niveau:</span>
                    <span class="value">{{1.niveau_kitesurf}}</span>
                </div>
            </div>
            
            <!-- Détails du Séjour -->
            <div class="info-block">
                <h3>📅 Détails du Séjour</h3>
                <div class="info-row">
                    <span class="label">Package:</span>
                    <span class="value"><strong>{{1.package}}</strong></span>
                </div>
                <div class="info-row">
                    <span class="label">Dates:</span>
                    <span class="value">{{1.date_arrivee}} → {{1.date_depart}}</span>
                </div>
                <div class="info-row">
                    <span class="label">Durée:</span>
                    <span class="value">{{1.duree_sejour}} jours</span>
                </div>
                <div class="info-row">
                    <span class="label">Participants:</span>
                    <span class="value">{{1.nb_personnes}} personne(s)</span>
                </div>
                <div class="info-row">
                    <span class="label">Hébergement:</span>
                    <span class="value">{{1.hebergement}}</span>
                </div>
                <div class="info-row">
                    <span class="label">Formation:</span>
                    <span class="value">{{1.heures_formation}} heures</span>
                </div>
            </div>
            
            <!-- Prix -->
            <div class="price-block">
                <div>Prix Total</div>
                <div class="price">{{1.prix_total}}€</div>
            </div>
            
            <!-- Services Extra -->
            {{#if 1.services_extra}}
            <div class="services-list">
                <strong>➕ Services supplémentaires demandés:</strong><br>
                {{join(1.services_extra; " • ")}}
            </div>
            {{/if}}
            
            <!-- Notes -->
            {{#if 1.notes_commentaires}}
            <div class="info-block">
                <h3>📝 Notes du Client</h3>
                <p>{{1.notes_commentaires}}</p>
            </div>
            {{/if}}
            
            <!-- Actions -->
            <div class="action-block">
                <strong>⚡ Actions à effectuer:</strong>
                <ol style="margin: 10px 0 0 20px;">
                    <li>Vérifier la disponibilité dans Notion</li>
                    <li>Confirmer le prix et les services</li>
                    <li>Envoyer email de confirmation au client sous 24h</li>
                    <li>Mettre à jour le statut dans Notion</li>
                </ol>
            </div>
            
            <!-- Liens utiles -->
            <div style="text-align: center; margin-top: 30px;">
                <a href="https://notion.so" style="display: inline-block; padding: 12px 30px; background: #0077b6; color: white; text-decoration: none; border-radius: 5px; margin: 0 10px;">
                    📋 Voir dans Notion
                </a>
                <a href="mailto:{{1.email}}?subject=Re: Votre réservation WindVenture" style="display: inline-block; padding: 12px 30px; background: #48bb78; color: white; text-decoration: none; border-radius: 5px; margin: 0 10px;">
                    ✉️ Répondre au client
                </a>
            </div>
        </div>
        
        <div class="footer">
            <p>
                Source: {{1.source_reservation}} | 
                Statut: {{1.statut_reservation}} | 
                Paiement: {{1.statut_paiement}}
            </p>
            <p>WindVenture - Kitesurf Dakhla © 2025</p>
        </div>
    </div>
</body>
</html>
```

## 🔧 OPTION 2 : MODULE MICROSOFT 365 EMAIL (POUR OFFICE 365)

Si vous avez un compte Office 365 professionnel :

1. **Ajouter le module** : "Microsoft 365 Email" → "Send an Email"
2. **Connexion** : Avec votre compte Office 365
3. **Configuration** : Identique à l'Option 1

## ✅ TEST DE CONFIGURATION

### Test rapide dans Make.com :
1. **Run once** sur votre scénario
2. **Envoyez une requête test** :

```bash
curl -X POST https://hook.eu2.make.com/bfncwe5cc93t2g8d22pw1ao60g5v2rcl \
  -H "Content-Type: application/json" \
  -d '{
    "client": "Test Outlook",
    "email": "votre-email@outlook.com",
    "telephone": "+33600000000",
    "package": "beginner-private",
    "date_arrivee": "2025-05-01",
    "date_depart": "2025-05-08",
    "duree_sejour": 7,
    "nb_personnes": 1,
    "niveau_kitesurf": "Débutant",
    "hebergement": "Hôtel partenaire",
    "services_extra": ["Transfert aéroport"],
    "notes_commentaires": "Test configuration Outlook",
    "source_reservation": "Test Make.com",
    "prix_total": 720,
    "heures_formation": 6,
    "statut_reservation": "⏳ EN ATTENTE",
    "statut_paiement": "En attente"
  }'
```

### Vérifications :
- ✅ Email reçu dans Outlook
- ✅ Format HTML correct
- ✅ Tous les champs affichés
- ✅ Liens cliquables

## 🚨 RÉSOLUTION DE PROBLÈMES

### Erreur de connexion Outlook :
1. Vérifiez que l'authentification à deux facteurs est activée
2. Utilisez un mot de passe d'application si nécessaire
3. Vérifiez les permissions dans Outlook > Paramètres > Confidentialité

### Email non reçu :
1. Vérifiez le dossier Spam/Courrier indésirable
2. Vérifiez l'adresse email dans le module
3. Testez avec une adresse différente

### Format HTML cassé :
1. Utilisez le "Body Type: HTML" (pas Text)
2. Vérifiez la syntaxe HTML
3. Testez d'abord avec un template simple

## 📊 AVANTAGES OUTLOOK DANS MAKE.COM

✅ **Intégration native** avec Microsoft
✅ **Pas de limite** d'envoi (dans les limites Outlook)
✅ **Tracking** des emails envoyés
✅ **Templates HTML** riches
✅ **Pièces jointes** possibles
✅ **Réponses automatiques** configurables

## 🎯 PROCHAINES ÉTAPES

1. **Tester** le workflow complet
2. **Personnaliser** le template email
3. **Ajouter** un email de confirmation client
4. **Configurer** des rappels automatiques
5. **Monitorer** les taux d'ouverture

---

💡 **Astuce** : Créez un dossier "WindVenture" dans Outlook pour regrouper automatiquement toutes les notifications de réservation.