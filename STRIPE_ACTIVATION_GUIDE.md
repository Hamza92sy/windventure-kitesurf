# 🚀 Guide d'activation Stripe - Windventure.fr

## Statut actuel
✅ **Site 100% fonctionnel en mode démo**
- Flux de réservation complet
- Page de confirmation professionnelle  
- Logs des réservations dans Vercel
- Expérience client parfaite

## Pour activer les vrais paiements Stripe (plus tard)

### Étape 1: Récupérer vos clés Stripe
1. Connectez-vous à https://dashboard.stripe.com
2. **Developers** → **API keys**
3. Copiez votre **Secret key** (sk_live_...)
4. Copiez votre **Publishable key** (pk_live_...)

### Étape 2: Mise à jour des variables d'environnement
```bash
# Remplacer la clé secrète
vercel env add STRIPE_SECRET_KEY production --force
# Entrez votre vraie clé sk_live_...

# Remplacer la clé publique  
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production --force
# Entrez votre vraie clé pk_live_...
```

### Étape 3: Créer les produits Stripe
```bash
# Le script est prêt dans scripts/setup-stripe-products.js
# Il suffit de mettre à jour la clé dans le fichier puis :
node scripts/setup-stripe-products.js
```

### Étape 4: Mettre à jour le code avec les Price IDs
Le script vous donnera les nouveaux Price IDs à copier dans :
`app/book/page.tsx` ligne 19-24

### Étape 5: Déployer
```bash
vercel deploy --prod
```

## Produits à créer dans Stripe

| Package | Prix | Description |
|---------|------|-------------|
| Beginner Private | €720 | One-on-one kitesurfing instruction |
| Beginner Semi-Private | €1,100 | Small group lessons (2-3 people) |
| Exploration Package | €1,250 | Guided exploration of best spots |
| Combined Package | €1,350 | Ultimate complete experience |

## Support
- **Email:** hamzaseidou582@gmail.com
- **WhatsApp:** +212 760 981 401

---

**Note:** Le site fonctionne parfaitement en mode démo. Aucune urgence pour activer Stripe - cela peut être fait à tout moment sans affecter le site.