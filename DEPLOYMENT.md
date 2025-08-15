# 🚀 Script de Déploiement Automatisé WindVenture

## Démarrage Rapide

### Test (Recommandé d'abord)
```bash
npm run deploy:test
```

### Déploiement Automatisé
```bash
npm run deploy:auto
```

## Ce que fait le script

✅ **Backup** automatique avant déploiement  
✅ **Validations** : Git, dépendances, TypeScript, ESLint  
✅ **Build** Next.js optimisé  
✅ **Deploy** Vercel avec retry automatique  
✅ **Cache** invalidation complète  
✅ **Health checks** : Site disponible + contenu correct  
✅ **Rollback** automatique si échec  

## Important

- Le script utilise **`windventure.fr`** (minuscules) comme référence
- Health checks vérifient que le site fonctionne correctement
- Rollback automatique si problème détecté
- Logs colorés en temps réel + rapport JSON

## En cas de problème

1. Vérifiez les logs détaillés
2. Le script fait un rollback automatique
3. Rapport JSON sauvegardé pour debug

---

**Créé par :** Hamza Seidou - windventure.fr