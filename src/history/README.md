# Windventure History Directory

Ce dossier contient l'historique des modifications importantes du projet Windventure.

## Structure

```
history/
├── README.md                    # Ce fichier
├── backup_YYYYMMDD_HHMMSS.md   # Entrées d'historique des sauvegardes
├── cursor_logs/                 # Logs automatiques de Cursor
└── claude_logs/                 # Logs de Claude CLI (si applicable)
```

## Types d'Entrées

### 1. Sauvegardes Automatiques
- **Format**: `backup_YYYYMMDD_HHMMSS.md`
- **Contenu**: État du projet au moment de la sauvegarde
- **Création**: Automatique via `src/scripts/backup.sh`

### 2. Logs Cursor
- **Format**: `CURSOR_LOG_YYYY-MM-DD.md`
- **Contenu**: Modifications effectuées par Cursor Pro
- **Création**: Automatique via les scripts d'automatisation

### 3. Logs Claude
- **Format**: `CLAUDE_*.md`
- **Contenu**: Rapports et modifications de Claude CLI
- **Création**: Par Claude CLI (ne pas modifier manuellement)

## Utilisation

### Consulter l'Historique
```bash
# Voir toutes les entrées d'historique
ls -la history/

# Voir les dernières sauvegardes
ls -t history/backup_*.md | head -5

# Voir les logs Cursor du jour
cat CURSOR_LOG_$(date '+%Y-%m-%d').md
```

### Restaurer une Sauvegarde
```bash
# Lister les sauvegardes disponibles
ls -la windventure_backup_*/

# Restaurer une sauvegarde spécifique
cp -r windventure_backup_YYYYMMDD_HHMMSS/* .
```

### Nettoyer l'Historique
```bash
# Nettoyer les anciennes sauvegardes
./src/scripts/backup.sh --clean

# Voir les informations de sauvegarde
./src/scripts/backup.sh --info
```

## Règles Importantes

1. **Ne jamais supprimer** les fichiers `CLAUDE_*.md` - ils sont créés par Claude CLI
2. **Ne jamais modifier** les entrées d'historique existantes
3. **Toujours créer** de nouvelles entrées pour les modifications importantes
4. **Conserver** au moins les 10 dernières sauvegardes

## Compatibilité

Ce système d'historique est compatible avec :
- ✅ Cursor Pro
- ✅ Claude CLI
- ✅ Gemini CLI
- ✅ Vercel Auto-Deploy
- ✅ Git Workflow

## Maintenance

### Nettoyage Automatique
Les scripts d'automatisation nettoient automatiquement :
- Sauvegardes anciennes (garde max 10)
- Logs temporaires
- Fichiers de cache

### Sauvegarde Manuelle
```bash
# Créer une sauvegarde manuelle
./src/scripts/backup.sh

# Vérifier une sauvegarde
./src/scripts/backup.sh --verify
```

## Intégration avec les Outils

### Cursor Pro
- Crée automatiquement des logs dans `CURSOR_LOG_YYYY-MM-DD.md`
- Sauvegarde avant chaque commit important
- Intègre avec le système de déploiement Vercel

### Claude CLI
- Respecte les fichiers `CLAUDE_*.md` existants
- Peut créer de nouvelles entrées d'historique
- Compatible avec le système de sauvegarde

### Vercel
- Déploiement automatique à chaque push
- Intégration avec les logs de déploiement
- Sauvegarde avant déploiement

---

*Dernière mise à jour : $(date)*
*Système d'historique Windventure v1.0*
