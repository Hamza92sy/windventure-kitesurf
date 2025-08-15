# 🚀 WindVenture Deployment Automation

## Vue d'ensemble

Script de déploiement automatisé ultra-complet et sécurisé pour WindVenture.fr qui automatise :

- ✅ Validations pré-déploiement (Git, dépendances, configuration)
- 🏗️ Build Next.js optimisé avec nettoyage de cache
- 🚀 Déploiement Vercel avec retry automatique
- 🔄 Invalidation cache aggressive (Vercel, CDN, DNS)
- 🔍 Vérifications santé complètes (disponibilité, contenu, performance, SEO)
- 🔙 Rollback automatique en cas d'échec
- 📊 Rapports détaillés avec logs complets

## Installation

```bash
# Installation de la dépendance requise
npm install node-fetch

# Rendre les scripts exécutables
chmod +x scripts/deployment-automation.js
chmod +x scripts/deployment-test.js
```

## Utilisation

### 🧪 Mode Test (Dry Run)

**Recommandé avant le premier usage :**

```bash
# Test complet sans déploiement réel
node scripts/deployment-test.js

# Ou directement
./scripts/deployment-test.js
```

### 🚀 Déploiement Production

```bash
# Déploiement complet automatisé
node scripts/deployment-automation.js

# Ou directement
./scripts/deployment-automation.js
```

## Fonctionnalités Détaillées

### 🔒 Sécurité

- **Backup automatique** : Crée une branche `main-backup` avant déploiement
- **Rollback automatique** : Revient à l'état précédent si les health checks échouent
- **Validation stricte** : Vérifications multiples avant déploiement

### 🧪 Validations Pré-déploiement

1. **Git Status** : Auto-commit des changements non-commitées
2. **Dépendances** : Vérification et installation si nécessaire
3. **Configuration** : Validation `next.config.js` et `tailwind.config.ts`
4. **Linting** : ESLint avec continuation sur warnings
5. **TypeScript** : Type check avec tolérance en production

### 🏗️ Build Optimisé

- Nettoyage cache `.next`
- Build production avec optimisations
- Analyse taille bundles
- Variables d'environnement optimisées

### 🚀 Déploiement Vercel

- 3 tentatives automatiques en cas d'échec
- Force deployment (bypass cache)
- Attente 10s entre tentatives
- Logs détaillés de chaque étape

### 🔄 Invalidation Cache

1. **Vercel Cache** : Purge via simulation API
2. **CDN Cache** : Cache busting avec timestamp
3. **Cloudflare** : Purge si applicable
4. **DNS Local** : Flush cache système

### 🔍 Health Checks

1. **Disponibilité** : Test `windventure.fr` et `windventure-premium.vercel.app`
2. **Contenu** : Vérification éléments critiques page d'accueil
3. **Performance** : Mesure temps de chargement (<3s)
4. **SEO** : Validation title, meta description, H1
5. **Images** : Détection images optimisées Next.js

### 📊 Rapports

- Logs colorés en temps réel
- Sauvegarde rapport JSON complet
- Durée totale d'exécution
- Statut détaillé de chaque étape

## Configuration

Le script utilise cette configuration par défaut :

```javascript
{
    projectName: 'windventure-premium',
    domain: 'windventure.fr',
    vercelUrl: 'windventure-premium.vercel.app',
    backupBranch: 'main-backup',
    maxRetries: 3,
    healthCheckTimeout: 30000,
    cacheInvalidationUrls: [
        'https://windventure.fr',
        'https://windventure-premium.vercel.app'
    ]
}
```

## Codes de Sortie

- `0` : Déploiement réussi
- `1` : Échec (avec rollback automatique)

## Exemples d'Utilisation

### Déploiement Standard

```bash
# Déploiement complet avec toutes les vérifications
./scripts/deployment-automation.js
```

### Test Avant Déploiement

```bash
# Test pour valider le script sans déployer
./scripts/deployment-test.js
```

### Intégration CI/CD

```yaml
# Exemple GitHub Actions
- name: Deploy WindVenture
  run: node scripts/deployment-automation.js
```

## Logs et Monitoring

### Types de Logs

- 🔵 **INFO** : Informations générales
- 🟢 **SUCCESS** : Étapes réussies
- 🟡 **WARNING** : Avertissements non-bloquants
- 🔴 **ERROR** : Erreurs critiques
- 🟣 **STEP** : Étapes principales

### Rapports JSON

Chaque exécution génère un fichier `deployment-report-{timestamp}.json` :

```json
{
  "timestamp": "2025-08-15T10:30:00.000Z",
  "duration": "45s",
  "logs": ["..."],
  "status": "completed"
}
```

## Dépannage

### Erreurs Communes

1. **"node-fetch not found"**
   ```bash
   npm install node-fetch
   ```

2. **"Permission denied"**
   ```bash
   chmod +x scripts/deployment-automation.js
   ```

3. **"Backup branch exists"**
   - Normal : l'ancien backup est automatiquement supprimé

4. **"TypeScript errors"**
   - Le script continue avec warnings en production
   - Corrigez les erreurs TS pour un code plus propre

### Health Check Failures

Si les health checks échouent :
1. Le rollback automatique s'active
2. Le site revient à l'état précédent
3. Vérifiez les logs pour identifier le problème

## Sécurité

- ✅ Backup automatique avant chaque déploiement
- ✅ Rollback en cas d'échec des health checks
- ✅ Validation stricte avant déploiement
- ✅ Logs détaillés pour audit
- ✅ Pas de secrets exposés dans les logs

## Performance

- ⚡ Build optimisé avec cache cleaning
- ⚡ Cache invalidation aggressive
- ⚡ Health checks en parallèle
- ⚡ Retry automatique pour résilience

## Maintenance

### Mise à Jour du Script

1. Modifier `scripts/deployment-automation.js`
2. Tester avec `deployment-test.js`
3. Committer les changements

### Ajout de Health Checks

Ajouter de nouvelles vérifications dans `runHealthChecks()` :

```javascript
const checks = [
    () => this.checkSiteAvailability(),
    () => this.checkContentIntegrity(),
    () => this.checkCustomFeature() // Nouvelle vérification
];
```

## Support

Pour toute question ou problème :
1. Vérifiez les logs détaillés
2. Consultez le rapport JSON généré
3. Testez avec `deployment-test.js` d'abord

---

**Créé par :** Hamza Seidou - WindVenture.fr  
**Version :** 1.0.0  
**Dernière mise à jour :** 2025-08-15