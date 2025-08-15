# 📚 Système d'Organisation Automatique - Windventure

## 🎯 Vue d'ensemble

Le système d'organisation automatique de l'historique Windventure permet de maintenir une structure
propre et organisée des rapports, analyses et documents du projet.

## 🚀 Fonctionnalités

### ✅ Automatisation complète

- **Déplacement automatique** des rapports terminés vers `archive/`
- **Génération automatique** de l'index `HISTORY_INDEX.md`
- **Détection intelligente** des outils utilisés (Claude, Cursor, Gemini, ChatGPT)
- **Prévention des doublons** avec vérification automatique

### 📁 Structure organisée

```
src/history/
├── archive/           # Rapports terminés
├── HISTORY_INDEX.md   # Index automatique
├── README.md         # Documentation
└── README_ORGANIZATION.md  # Ce fichier
```

### 🎨 Interface utilisateur

- **Raccourci clavier:** `Cmd+Shift+H` (macOS) / `Ctrl+Shift+H` (Windows/Linux)
- **Tâche VS Code:** "Windventure: Organize History"
- **Commande manuelle:** `bash src/scripts/organize-history.sh`

## 📋 Patterns de détection

### 🔄 Fichiers terminés (déplacés automatiquement)

- `*FIX*.md` - Corrections et fixes
- `*REPORT*.md` - Rapports généraux
- `*SUCCESS*.md` - Succès et validations
- `*COMPLETE*.md` - Tâches complétées
- `*FINAL*.md` - Versions finales
- `*ACCOMPLISHED*.md` - Missions accomplies
- `*VALIDATION*.md` - Validations
- `*AUDIT*.md` - Audits et vérifications
- `*ANALYSIS*.md` - Analyses
- `*DIAGNOSTIC*.md` - Diagnostics
- `*SOLUTION*.md` - Solutions
- `*DEPLOY*.md` - Déploiements
- `*BACKUP*.md` - Sauvegardes
- `*TRANSFORMATION*.md` - Transformations
- `*IMPLEMENTATION*.md` - Implémentations
- `*CORRECTION*.md` - Corrections
- `*MONITORING*.md` - Monitoring
- `*PREPARATION*.md` - Préparations
- `*COMPARATIVE*.md` - Analyses comparatives
- `*GALLERY*.md` - Galeries
- `*MATRIX*.md` - Matrices
- `*TYPOGRAPHY*.md` - Typographie
- `*COMPONENTS*.md` - Composants
- `*DEPENDENCIES*.md` - Dépendances
- `*ENV_INJECTION*.md` - Injection d'environnement
- `*FORM_REDESIGN*.md` - Redesign de formulaires
- `*PACKAGE_PAGE*.md` - Pages de packages
- `*BOOKING_*.md` - Système de réservation
- `*HYDRATATION*.md` - Hydratation
- `*PHASE_*.md` - Phases du projet
- `*MISSION_*.md` - Missions
- `*WINDVENTURE_*.md` - Rapports Windventure
- `*CURSOR_*.md` - Rapports Cursor
- `*CLAUDE_*.md` - Rapports Claude
- `*FIGMA_*.md` - Rapports Figma
- `*TAILWIND_*.md` - Rapports Tailwind
- `*PRODUCTION_*.md` - Production
- `*REDEPLOY_*.md` - Redéploiements
- `*FORCE_DEPLOY*.md` - Déploiements forcés
- `*VERCEL_*.md` - Vercel
- `*SUPABASE_*.md` - Supabase
- `*STRIPE_*.md` - Stripe
- `*N8N_*.md` - n8n
- `*OPENAI_*.md` - OpenAI
- `*GEMINI_*.md` - Gemini
- `*CHATGPT_*.md` - ChatGPT

### ⏸️ Fichiers actifs (ignorés)

- `*TODO*.md` - Tâches à faire
- `*prompt*.md` - Prompts
- `*ACTIVE_*.md` - Fichiers actifs
- `*IN_PROGRESS*.md` - En cours
- `*DRAFT*.md` - Brouillons
- `*WORKING*.md` - En travail
- `*TEST*.md` - Tests
- `*DEBUG*.md` - Debug
- `*TEMP*.md` - Temporaires
- `*BACKUP_*.md` - Sauvegardes

## 🤖 Détection automatique des outils

Le script analyse automatiquement le contenu des fichiers pour les classer par outil :

- **🤖 Claude** - Fichiers contenant "claude"
- **🎯 Cursor** - Fichiers contenant "cursor"
- **🌟 Gemini** - Fichiers contenant "gemini"
- **💬 ChatGPT** - Fichiers contenant "chatgpt" ou "gpt"
- **🔧 Autre** - Fichiers non classés

## 📊 Statistiques générées

L'index automatique inclut :

- **Total des rapports archivés**
- **Date de dernière organisation**
- **Référence au script utilisé**

## 🔧 Configuration VS Code

### Tâche ajoutée dans `.vscode/tasks.json`

```json
{
  "label": "Windventure: Organize History",
  "type": "shell",
  "command": "bash src/scripts/organize-history.sh",
  "problemMatcher": [],
  "presentation": {
    "reveal": "always",
    "panel": "shared"
  },
  "detail": "Déplace les rapports terminés, crée archive/, génère HISTORY_INDEX.md"
}
```

### Raccourci ajouté dans `.vscode/keybindings.json`

```json
{
  "key": "cmd+shift+h",
  "command": "workbench.action.tasks.runTask",
  "args": "Windventure: Organize History"
}
```

## 🎯 Utilisation

### 1. Raccourci clavier (recommandé)

- **macOS:** `Cmd+Shift+H`
- **Windows/Linux:** `Ctrl+Shift+H`

### 2. Palette de commandes VS Code

1. Ouvrir la palette (`Cmd+Shift+P`)
2. Taper "Tasks: Run Task"
3. Sélectionner "Windventure: Organize History"

### 3. Terminal

```bash
bash src/scripts/organize-history.sh
```

## 📝 Exemple de sortie

```
🎯 Windventure: Organize History
================================
✅ Dossier archive existe déjà
📦 Déplacement des rapports terminés...
  ✅ Déplacé: FIX_16_ERRORS.md
  ⚠️  Existe déjà: HYDRATATION_FIX_REPORT.md
✅ Déplacement terminé: 1 fichiers déplacés, 139 ignorés
📄 Génération de HISTORY_INDEX.md...
✅ HISTORY_INDEX.md généré
================================
🎉 Organisation terminée !
📁 Archive: src/history/archive
📄 Index: src/history/HISTORY_INDEX.md
📊 Rapports archivés: 63
================================
```

## 🔄 Maintenance

Le système est entièrement automatique et ne nécessite aucune maintenance manuelle. Il suffit
d'exécuter le script régulièrement pour maintenir l'organisation.

## 🚨 Notes importantes

- Les fichiers actifs ne sont jamais déplacés automatiquement
- Les doublons sont détectés et évités
- L'index est régénéré à chaque exécution
- Le script est compatible avec les versions anciennes de bash

---

**Dernière mise à jour:** 31/07/2025 **Script:** `src/scripts/organize-history.sh`
