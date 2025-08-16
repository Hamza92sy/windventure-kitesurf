# 🔑 GUIDE DE CONFIGURATION STRIPE POUR WINDVENTURE.FR

## 📋 PRÉREQUIS
- Compte Stripe actif (https://dashboard.stripe.com)
- Accès au dashboard Vercel (https://vercel.com/dashboard)
- Projet windventure déployé sur Vercel

---

## 🎯 ÉTAPE 1: RÉCUPÉRER LES CLÉS STRIPE

### 1.1 Connexion au Dashboard Stripe
1. Allez sur https://dashboard.stripe.com
2. Connectez-vous avec vos identifiants

### 1.2 Mode TEST vs LIVE
⚠️ **IMPORTANT**: Stripe a deux modes :
- **TEST** (pour développement) : clés commencent par `sk_test_` et `pk_test_`
- **LIVE** (pour production) : clés commencent par `sk_live_` et `pk_live_`

Pour activer le mode LIVE :
1. Cliquez sur le switch "Test mode" en haut à droite
2. Basculez sur "Live mode"

### 1.3 Récupérer les clés API
1. Cliquez sur **"Developers"** dans le menu
2. Cliquez sur **"API keys"**
3. Copiez les clés suivantes :

```
PUBLISHABLE KEY (commence par pk_live_) :
pk_live_51...........................

SECRET KEY (commence par sk_live_) :
sk_live_51...........................
```

⚠️ **SÉCURITÉ** : Ne partagez JAMAIS la SECRET KEY !

---

## 🔧 ÉTAPE 2: CONFIGURER DANS VERCEL

### 2.1 Accéder aux settings du projet
1. Allez sur https://vercel.com/dashboard
2. Cliquez sur le projet **windventure-premium**
3. Allez dans l'onglet **"Settings"**
4. Cliquez sur **"Environment Variables"** dans le menu gauche

### 2.2 Ajouter les variables d'environnement

Ajoutez ces 3 variables EXACTEMENT comme indiqué :

#### Variable 1: STRIPE_SECRET_KEY
```
Key: STRIPE_SECRET_KEY
Value: [Collez votre sk_live_... ici]
Environment: ✅ Production ✅ Preview ✅ Development
```
Cliquez sur **"Save"**

#### Variable 2: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```
Key: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: [Collez votre pk_live_... ici]
Environment: ✅ Production ✅ Preview ✅ Development
```
Cliquez sur **"Save"**

#### Variable 3: NEXT_PUBLIC_BASE_URL
```
Key: NEXT_PUBLIC_BASE_URL
Value: https://windventure.fr
Environment: ✅ Production
```
Cliquez sur **"Save"**

---

## 🔔 ÉTAPE 3: CONFIGURER LE WEBHOOK STRIPE

### 3.1 Créer un nouveau webhook
1. Dans Stripe Dashboard, allez dans **"Developers"** → **"Webhooks"**
2. Cliquez sur **"Add endpoint"**
3. Configuration :
   ```
   Endpoint URL: https://windventure.fr/api/stripe-webhook
   Description: WindVenture Production Webhook
   ```

### 3.2 Sélectionner les événements
Cochez les événements suivants :
- ✅ `checkout.session.completed`
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`
- ✅ `charge.succeeded`
- ✅ `charge.failed`

Cliquez sur **"Add endpoint"**

### 3.3 Récupérer le Webhook Secret
1. Après création, cliquez sur le webhook
2. Dans "Signing secret", cliquez sur **"Reveal"**
3. Copiez la clé (commence par `whsec_`)

### 3.4 Ajouter dans Vercel
Retournez dans Vercel Environment Variables et ajoutez :

#### Variable 4: STRIPE_WEBHOOK_SECRET
```
Key: STRIPE_WEBHOOK_SECRET
Value: [Collez votre whsec_... ici]
Environment: ✅ Production
```
Cliquez sur **"Save"**

---

## 🚀 ÉTAPE 4: REDÉPLOYER

### 4.1 Forcer le redéploiement
1. Dans Vercel, allez dans l'onglet **"Deployments"**
2. Cliquez sur les 3 points (...) du dernier déploiement
3. Cliquez sur **"Redeploy"**
4. Confirmez **"Redeploy with existing Build Cache"**

### 4.2 Attendre le déploiement
- Durée : ~2-3 minutes
- Vérifiez le statut : doit afficher "Ready" en vert

---

## ✅ ÉTAPE 5: VÉRIFICATION

### 5.1 Test rapide de l'API
Ouvrez un terminal et exécutez :
```bash
curl -X POST https://windventure.fr/api/test \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

Réponse attendue : HTTP 200 ou message JSON

### 5.2 Test de paiement
1. Allez sur https://windventure.fr
2. Cliquez sur "Book Now" sur un package
3. Remplissez le formulaire
4. Vous devez être redirigé vers Stripe Checkout

### 5.3 Test avec carte de test (MODE TEST uniquement)
Si vous êtes en mode TEST, utilisez ces cartes :
- **Succès** : 4242 4242 4242 4242
- **Décliné** : 4000 0000 0000 0002
- Date expiration : N'importe quelle date future
- CVC : N'importe quel 3 chiffres

---

## 🔍 DÉPANNAGE

### Erreur 405 sur l'API
→ Le déploiement n'est pas terminé, attendez 2 min

### Erreur 500 "API key missing"
→ Vérifiez que STRIPE_SECRET_KEY est bien configurée dans Vercel

### Page Stripe vide ou erreur
→ Vérifiez NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

### Webhook ne reçoit pas d'événements
→ Vérifiez l'URL : doit être exactement https://windventure.fr/api/stripe-webhook

### "Invalid signature" sur webhook
→ Vérifiez STRIPE_WEBHOOK_SECRET dans Vercel

---

## 📊 MONITORING

### Dashboard Stripe
- **Payments** : Voir tous les paiements reçus
- **Customers** : Liste des clients
- **Events** : Historique des webhooks
- **Logs** : Tous les appels API

### Vérifier les logs Vercel
```bash
vercel logs windventure-premium --follow
```

---

## 🔒 SÉCURITÉ

### ⚠️ RÈGLES IMPORTANTES
1. **JAMAIS** de clés dans le code source
2. **JAMAIS** de clés dans les commits Git
3. **TOUJOURS** utiliser les Environment Variables
4. **ROTATION** des clés tous les 6 mois

### Rotation des clés
1. Générez de nouvelles clés dans Stripe
2. Mettez à jour dans Vercel
3. Redéployez
4. Supprimez les anciennes clés

---

## 📞 SUPPORT

### Stripe Support
- Documentation : https://stripe.com/docs
- Support : https://support.stripe.com
- Status : https://status.stripe.com

### Vercel Support
- Documentation : https://vercel.com/docs
- Support : https://vercel.com/support

---

## ✅ CHECKLIST FINALE

- [ ] Clés API récupérées depuis Stripe
- [ ] Mode LIVE activé (pas TEST)
- [ ] 4 variables configurées dans Vercel
- [ ] Webhook créé et configuré
- [ ] Redéploiement effectué
- [ ] Test de paiement réussi
- [ ] Webhook reçoit les événements

---

**🎉 Une fois cette configuration terminée, WindVenture.fr peut accepter des paiements réels !**

*Dernière mise à jour : 16/08/2025*