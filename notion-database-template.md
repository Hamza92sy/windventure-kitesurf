# 📊 Template Base de Données Notion pour Claude

## 🏗️ Structure de la Database "Projets Claude"

### Properties (Colonnes) à créer :

1. **Nom** (Title) - Titre principal
2. **Status** (Select)
   - 🟢 En cours
   - ✅ Terminé  
   - ⚠️ Problème
   - 🔄 En attente
   - 🚨 Urgent

3. **Type** (Select)
   - 🎨 Design/CSS
   - 🔧 Fix technique
   - 📊 Diagnostic
   - 🚀 Déploiement
   - 🛠️ Infrastructure

4. **Priorité** (Select)
   - 🔥 Critique
   - ⚡ Haute
   - 📋 Normale  
   - 🔄 Basse

5. **Date de Création** (Created time)
6. **Dernière Mise à Jour** (Last edited time)
7. **Assigné à** (Person) - Vous
8. **Description** (Rich text)
9. **Résultats** (Rich text)
10. **Repository** (URL)
11. **Branch** (Text)
12. **Commit SHA** (Text)

## 🔗 Après création :

1. **Partager** la database avec l'intégration Claude
2. **Copier** l'ID de la database (dans l'URL)
3. **Format ID** : `https://notion.so/DATABASE_ID?v=...`

## 📝 Template de Page pour chaque projet :

```
# 🎯 [NOM DU PROJET]

## 📋 Résumé
Description du projet et objectifs

## 🔧 Actions Réalisées
- [ ] Action 1
- [ ] Action 2
- [ ] Action 3

## 📊 Résultats
Résultats techniques et métriques

## 🚀 Déploiement
Status du déploiement et URLs

## 📝 Notes
Remarques et observations
```