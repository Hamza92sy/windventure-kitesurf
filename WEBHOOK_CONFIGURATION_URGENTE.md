# 🚨 CONFIGURATION URGENTE DU WEBHOOK STRIPE

## ⚠️ PROBLÈME DÉTECTÉ
Le webhook retourne une erreur 400, ce qui signifie que la signing secret n'est pas configurée correctement dans Vercel.

## 🔧 ACTIONS IMMÉDIATES À FAIRE

### 1️⃣ **DANS STRIPE DASHBOARD (5 minutes)**

1. **Connectez-vous:** https://dashboard.stripe.com
2. **Allez dans:** Developers → Webhooks
3. **Cliquez:** "Add endpoint"
4. **Configurez:**
   - **Endpoint URL:** `https://windventure.fr/api/stripe-webhook`
   - **Description:** Windventure Production
5. **Sélectionnez ces événements:**
   - ✅ checkout.session.completed
   - ✅ payment_intent.succeeded
   - ✅ payment_intent.payment_failed
6. **Cliquez:** "Add endpoint"

### 2️⃣ **RÉCUPÉRER LA SIGNING SECRET**

Après création:
1. Cliquez sur le webhook créé
2. Section "Signing secret"
3. Cliquez "Reveal"
4. **COPIEZ** la clé (format: `whsec_...`)

### 3️⃣ **METTRE À JOUR DANS VERCEL (2 minutes)**

1. **Ouvrez:** https://vercel.com/windventure/windventure-premium/settings/environment-variables
2. **Trouvez:** `STRIPE_WEBHOOK_SECRET`
3. **Cliquez:** sur les 3 points → Edit
4. **Remplacez** la valeur par la nouvelle signing secret
5. **IMPORTANT:** Cochez "Production" et "Preview"
6. **Cliquez:** "Save"

### 4️⃣ **REDÉPLOYER L'APPLICATION**

```bash
vercel --prod --force
```

Ou dans Vercel Dashboard:
1. Onglet "Deployments"
2. Cliquez sur les 3 points du dernier déploiement
3. "Redeploy" → "Use existing Build Cache"

---

## ✅ TEST DE VÉRIFICATION

### Test Rapide (depuis Stripe Dashboard)
1. Dans votre webhook → "Send test webhook"
2. Sélectionnez `checkout.session.completed`
3. Send test webhook
4. Vérifiez: Status doit être **200 OK**

### Test Complet (avec un vrai paiement test)
1. Visitez: https://windventure.fr/book?package=combined
2. Remplissez le formulaire:
   - Email: test@example.com
   - Carte: `4242 4242 4242 4242`
   - Date: 12/25
   - CVC: 123
3. Complétez le paiement
4. Vérifiez dans Stripe → Webhooks → Recent deliveries

---

## 📊 RÉSULTAT ATTENDU

Dans Stripe Dashboard → Webhooks → Recent deliveries:
```
✅ Status: 200 OK
✅ Response time: < 500ms
✅ Event: checkout.session.completed
```

---

## 🔴 SI ÇA NE MARCHE PAS

### Erreur 400 (No signature)
→ La signing secret n'est pas configurée dans Vercel

### Erreur 401 (Invalid signature)
→ La signing secret ne correspond pas (mauvaise clé)

### Erreur 500 (Server error)
→ Problème dans le code du webhook

**Solution rapide:**
1. Recréez un nouveau webhook dans Stripe
2. Utilisez la nouvelle signing secret
3. Redéployez l'application

---

## 📱 CONTACT SUPPORT

Si problème persiste après ces étapes:
- Support Stripe: support@stripe.com
- Dashboard: https://dashboard.stripe.com/support

---

**⏱️ Temps total estimé: 10 minutes**
**🎯 Résultat: Webhook 100% fonctionnel pour windventure.fr**