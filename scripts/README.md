# 🚀 WindVenture Deployment Scripts

## Démarrage Rapide

### 1. Installation

```bash
npm install node-fetch
```

### 2. Test du Script (Recommandé)

```bash
# Test sans déploiement réel
npm run deploy:test
```

### 3. Déploiement Automatisé

```bash
# Déploiement complet automatisé
npm run deploy:auto
```

## Scripts Disponibles

| Script | Commande | Description |
|--------|----------|-------------|
| **Test** | `npm run deploy:test` | 🧪 Test dry-run sans déploiement |
| **Auto Deploy** | `npm run deploy:auto` | 🚀 Déploiement automatisé complet |
| **Manuel** | `npm run deploy` | 🔧 Déploiement Vercel standard |

## Fonctionnalités

✅ **Sécurité** : Backup + Rollback automatique  
✅ **Validations** : Git, dépendances, TypeScript, ESLint  
✅ **Build** : Next.js optimisé avec cache cleaning  
✅ **Deploy** : Vercel avec retry (3 tentatives)  
✅ **Cache** : Invalidation Vercel + CDN + DNS  
✅ **Health Checks** : Disponibilité + Contenu + Performance + SEO  
✅ **Logs** : Colorés + Rapport JSON détaillé  

## Health Checks

Le script vérifie automatiquement :
- 🌐 **Disponibilité** : windventure.fr accessible
- 📝 **Contenu** : Éléments critiques présents
- ⚡ **Performance** : Temps de chargement < 3s
- 🔍 **SEO** : Title, meta description, H1
- 🖼️ **Images** : Optimisation Next.js

## Rollback Automatique

Si les health checks échouent :
1. 🔙 Retour automatique au code précédent
2. 🔄 Push force vers main
3. 📊 Rapport d'erreur détaillé

## Documentation Complète

Voir [`docs/DEPLOYMENT-AUTOMATION.md`](../docs/DEPLOYMENT-AUTOMATION.md) pour tous les détails.

---

**Créé par :** Hamza Seidou - WindVenture.fr