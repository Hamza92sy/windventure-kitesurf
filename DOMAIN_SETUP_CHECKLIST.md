# 🌐 CHECKLIST CONFIGURATION DOMAINE WINDVENTURE.FR

## ✅ ÉTAPES VERCEL
- [ ] Connecté à Vercel Dashboard
- [ ] Projet windventure-premium sélectionné
- [ ] Domaine windventure.fr ajouté
- [ ] Domaine www.windventure.fr ajouté
- [ ] Redirection www → non-www configurée

## ✅ CONFIGURATION DNS (Chez votre registrar)
- [ ] Enregistrement A pour @ → 76.76.19.61
- [ ] Enregistrement A pour www → 76.76.19.61
- [ ] OU CNAME @ → cname.vercel-dns.com

## ✅ MISE À JOUR STRIPE
- [ ] Webhook endpoint mis à jour vers windventure.fr
- [ ] Clé webhook vérifiée dans .env.local
- [ ] Test de paiement effectué

## ✅ VARIABLES D'ENVIRONNEMENT VERCEL
- [ ] NEXT_PUBLIC_SITE_URL=https://windventure.fr
- [ ] NEXT_PUBLIC_BASE_URL=https://windventure.fr
- [ ] Toutes les variables Stripe présentes

## ✅ TESTS DE VALIDATION
- [ ] DNS propagé (vérifier avec: nslookup windventure.fr)
- [ ] SSL certificat actif (cadenas vert)
- [ ] Homepage charge correctement
- [ ] 4 packages affichés
- [ ] Page /packages fonctionne
- [ ] Page /book fonctionne
- [ ] Checkout Stripe fonctionne

## 📊 STATUT FINAL
- [ ] windventure.fr → Site live avec 4 packages
- [ ] Paiements Stripe opérationnels
- [ ] Ancien domaine vercel.app redirige automatiquement

## 🔍 COMMANDES DE VÉRIFICATION

```bash
# Vérifier propagation DNS
dig windventure.fr
nslookup windventure.fr

# Tester SSL
curl -I https://windventure.fr

# Vérifier redirection www
curl -I https://www.windventure.fr
```

## ⏱️ DÉLAIS ATTENDUS
- Propagation DNS: 15-30 minutes (max 48h)
- Certificat SSL: 5-60 minutes après DNS
- Disponibilité complète: ~1 heure

## 🆘 EN CAS DE PROBLÈME
1. Vérifier statut dans Vercel Dashboard → Domains
2. Attendre propagation DNS complète
3. Vider cache navigateur
4. Tester depuis autre réseau/device

---
*Checklist créée le 21/08/2025*