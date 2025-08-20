# 📚 Windventure.fr - Documentation des Scripts NPM

## 🚀 Scripts de Fix Complet

### `npm run fix:windventure`
**Description**: Lance le script principal de correction complète  
**Usage**: `npm run fix:windventure`  
**Fonctions**:
- ✅ Diagnostic visuel automatique
- ✅ Corrections de design automatiques  
- ✅ Test de build
- ✅ Validation locale
- ✅ Génération de rapport complet

### `npm run fix:complete` 
**Description**: Fix complet + test de développement  
**Usage**: `npm run fix:complete`  
**Équivalent**: `npm run fix:windventure && npm run dev:debug`

## 🔍 Scripts de Diagnostic

### `npm run diagnostic:visual`
**Description**: Analyse visuelle complète du site  
**Usage**: `npm run diagnostic:visual`  
**Génère**:
- 📊 windventure-visual-report.json
- 📸 Screenshots (desktop/mobile/tablet)
- 📋 Analyse Tailwind CSS
- 📐 Test responsive
- 🎨 Vérification couleurs/fonts

### `npm run test:visual:complete`
**Description**: Diagnostic + corrections automatiques  
**Usage**: `npm run test:visual:complete`  
**Équivalent**: `npm run diagnostic:visual && npm run fix:design`

## 🔧 Scripts de Correction

### `npm run fix:design`
**Description**: Corrections de design automatiques  
**Usage**: `npm run fix:design`  
**Actions**:
- 🎨 Configuration Tailwind optimisée
- 📱 Classes responsive ajoutées
- 🎯 Palette Windventure appliquée
- 📝 Typographie professionnelle
- 🖼️ Optimisation des images

## 🛠️ Scripts de Développement

### `npm run dev:debug`
**Description**: Build + démarrage dev avec debug  
**Usage**: `npm run dev:debug`  
**Équivalent**: `npm run build && npm run dev`

### `npm run check:tailwind`
**Description**: Surveillance Tailwind CSS en temps réel  
**Usage**: `npm run check:tailwind`  
**Fonction**: Watch mode pour compilation CSS

## 📊 Scripts de Rapport

### `npm run report:generate`
**Description**: Génère un rapport complet du projet  
**Usage**: `npm run report:generate`  
**Contenu**:
- 🖥️ Informations système
- 🏗️ Status de build  
- 📁 Statistiques fichiers
- 🔍 Diagnostic visuel
- ⚡ Métriques de performance

## 🔄 Scripts de Restauration

### `npm run restore:backup`
**Description**: Restaure la dernière sauvegarde  
**Usage**: `npm run restore:backup`  
**Fonction**: Restore automatique depuis `backups/`

## 📋 Workflows Recommandés

### 🚨 Correction d'Urgence
```bash
npm run fix:windventure
```

### 🔍 Analyse Détaillée
```bash
npm run diagnostic:visual
npm run report:generate
```

### 🛠️ Développement
```bash
npm run dev:debug
npm run check:tailwind  # Dans un autre terminal
```

### 🎯 Test Complet
```bash
npm run test:visual:complete
npm run fix:complete
```

### 💾 Restauration
```bash
npm run restore:backup
npm run build
```

## 🎨 Scripts Existants Principaux

| Script | Description |
|--------|-------------|
| `dev` | Serveur de développement |
| `build` | Compilation production |
| `start` | Serveur production |
| `lint` | Vérification ESLint |
| `type-check` | Vérification TypeScript |

## 🚀 Scripts de Déploiement

| Script | Description |
|--------|-------------|
| `deploy` | Déploiement Vercel production |
| `deploy:preview` | Déploiement Vercel preview |
| `deploy:auto` | Déploiement automatisé |

## 🧪 Scripts de Test

| Script | Description |
|--------|-------------|
| `test:css` | Tests CSS avec Playwright |
| `test:visual` | Tests de régression visuelle |
| `test:e2e` | Tests end-to-end |
| `test:unit` | Tests unitaires |

## 💡 Conseils d'Usage

### ⚡ Quick Fix
Pour une correction rapide:
```bash
npm run fix:design
npm run build
```

### 🔄 Full Reset
Pour un reset complet:
```bash
npm run restore:backup
npm run fix:windventure
```

### 📊 Monitoring
Pour surveiller en continu:
```bash
npm run check:tailwind &
npm run dev
```

---

*Documentation générée automatiquement - Windventure.fr*