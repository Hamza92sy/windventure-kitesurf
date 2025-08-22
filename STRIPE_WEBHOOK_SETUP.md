# 🔧 CONFIGURATION DU WEBHOOK STRIPE - WINDVENTURE.FR

## 📋 GUIDE ÉTAPE PAR ÉTAPE

### 1️⃣ **ACCÉDER AU DASHBOARD STRIPE**
- URL: https://dashboard.stripe.com
- Section: **Developers → Webhooks**

### 2️⃣ **CRÉER LE NOUVEAU WEBHOOK**

Cliquez sur **"Add endpoint"** et configurez:

| Paramètre | Valeur |
|-----------|--------|
| **Endpoint URL** | `https://windventure.fr/api/stripe-webhook` |
| **Description** | Windventure Production Webhook |
| **Version** | Latest API version |

### 3️⃣ **SÉLECTIONNER LES ÉVÉNEMENTS**

Cochez ces événements essentiels:

✅ **checkout.session.completed** *(Principal - déclenché après paiement)*
✅ **payment_intent.succeeded** *(Confirmation de paiement)*
✅ **payment_intent.payment_failed** *(Échec de paiement)*
✅ **customer.created** *(Optionnel - nouveau client)*
✅ **invoice.payment_succeeded** *(Optionnel - factures)*

### 4️⃣ **RÉCUPÉRER LA SIGNING SECRET**

Après création du webhook:
1. Cliquez sur le webhook créé
2. Section **"Signing secret"**
3. Cliquez sur **"Reveal"**
4. Copiez la clé (format: `whsec_...`)

### 5️⃣ **METTRE À JOUR VERCEL**

1. Allez sur: https://vercel.com/windventure/windventure-premium/settings/environment-variables
2. Mettez à jour la variable: **`STRIPE_WEBHOOK_SECRET`**
3. Collez la nouvelle signing secret
4. Cliquez sur **"Save"**
5. **IMPORTANT:** Redéployez pour appliquer les changements

---

## 🧪 TESTER LE WEBHOOK

### Option A: Test Rapide (Dashboard Stripe)
1. Dans Stripe Dashboard → Webhooks
2. Cliquez sur votre webhook
3. Onglet **"Send test webhook"**
4. Sélectionnez `checkout.session.completed`
5. Cliquez **"Send test webhook"**

### Option B: Test Complet (Stripe CLI)
```bash
# Installer Stripe CLI si nécessaire
brew install stripe/stripe-cli/stripe

# Lancer le test
./scripts/test-stripe-webhook.sh
```

### Option C: Test Réel
1. Visitez: https://windventure.fr/book?package=combined
2. Remplissez le formulaire
3. Utilisez la carte de test: `4242 4242 4242 4242`
4. Date d'expiration: Toute date future
5. CVC: N'importe quel 3 chiffres

---

## ✅ VÉRIFICATION

### Dans Stripe Dashboard
1. Webhooks → Votre endpoint
2. Section **"Recent deliveries"**
3. Vérifiez que les statuts sont **"Succeeded (200)"**

### Logs de succès attendus
```
✅ Payment completed: {
  sessionId: "cs_test_...",
  customerEmail: "client@example.com",
  amountTotal: 135000, // €1,350 en centimes
  packageId: "combined",
  participants: "1"
}
```

---

## 📦 RÉFÉRENCE - PRODUCT IDS

| Package | Prix | Product ID |
|---------|------|------------|
| **Beginner Private** | €720 | `price_1Reo9xHUqGxCezEFwTKoXkzJ` |
| **Semi-Private** | €1,100 | `price_1Reo8SHUqGxCezEF3ca4QL34` |
| **Exploration** | €1,250 | `price_1ReoC9HUqGxCezEFSDRUrGTz` |
| **Combined** | €1,350 | `price_1ReoApHUqGxCezEFCuWVKKGB` |

---

## 🚨 TROUBLESHOOTING

### Erreur 400: No signature
- Vérifiez que `STRIPE_WEBHOOK_SECRET` est bien configuré dans Vercel
- Assurez-vous d'avoir redéployé après modification

### Erreur 401: Invalid signature
- La signing secret ne correspond pas
- Vérifiez que vous utilisez la bonne clé (production vs test)

### Webhook ne reçoit rien
- Vérifiez l'URL: `https://windventure.fr/api/stripe-webhook`
- Testez avec: `curl -I https://windventure.fr/api/stripe-webhook`

---

## 📝 NOTES IMPORTANTES

1. **Ne supprimez pas l'ancien webhook immédiatement**
   - Gardez les deux actifs pendant 24-48h
   - Désactivez l'ancien une fois le nouveau confirmé

2. **Environnements multiples**
   - Production: `https://windventure.fr/api/stripe-webhook`
   - Staging: `https://windventure-premium.vercel.app/api/stripe-webhook`
   - Local: `http://localhost:3000/api/stripe-webhook`

3. **Sécurité**
   - Ne partagez JAMAIS la signing secret
   - Utilisez toujours HTTPS en production
   - Vérifiez toujours la signature dans votre code

---

## 🎯 CHECKLIST FINALE

- [ ] Webhook créé dans Stripe Dashboard
- [ ] URL configurée: `https://windventure.fr/api/stripe-webhook`
- [ ] Événements sélectionnés (minimum: checkout.session.completed)
- [ ] Signing secret récupérée
- [ ] STRIPE_WEBHOOK_SECRET mise à jour dans Vercel
- [ ] Application redéployée
- [ ] Test webhook réussi
- [ ] Vérification dans "Recent deliveries" (Status: 200)

---

*Documentation créée le 21/08/2025*
*Dernière mise à jour: Configuration pour windventure.fr avec 4 packages*