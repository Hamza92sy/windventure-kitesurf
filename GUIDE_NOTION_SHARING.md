# 🔗 GUIDE COMPLET - PARTAGER DATABASE AVEC INTÉGRATION NOTION

## 📋 PRÉREQUIS VALIDÉS
✅ Token API configuré : `ntn_444219917195...`
✅ Database ID : `bd6564c2340d48a0a9de89652594e47c`
✅ Authentification : Fonctionnelle (6 utilisateurs trouvés)
❌ Accès Database : Pas encore partagée

## 🎯 SOLUTION : PARTAGER LA DATABASE

### OPTION 1 : Depuis la page Notion

1. **Ouvrez** https://www.notion.so/Windventure-Command-Center-bd6564c2340d48a0a9de89652594e47c

2. **En haut à droite**, cliquez sur **"Share"** (Partager)

3. **Dans la fenêtre de partage :**
   ```
   Share to web: [Toggle si nécessaire]
   
   Invite: [Champ de recherche]
   → Tapez le nom de votre intégration
   → Elle apparaît avec 🧩 (icône puzzle)
   → Sélectionnez-la
   → Permissions: "Can edit" ou "Full access"
   → Cliquez "Invite"
   ```

4. **Vérifiez** que l'intégration apparaît dans la liste des membres

### OPTION 2 : Depuis les paramètres de l'intégration

1. **Allez sur** https://www.notion.so/my-integrations
2. **Cliquez** sur votre intégration
3. **Section "Capabilities"**, vérifiez :
   - ✅ Read content
   - ✅ Update content
   - ✅ Insert content

4. **Section "User Capabilities"** :
   - Read user information including email addresses

### OPTION 3 : Créer une nouvelle database de test

Si le partage ne fonctionne toujours pas :

1. **Dans Notion**, créez une nouvelle page
2. **Ajoutez** une database (table)
3. **Partagez** immédiatement avec l'intégration
4. **Copiez** l'ID de cette nouvelle database
5. **Testez** avec ce nouvel ID

## 🔍 VÉRIFICATION

Après le partage, exécutez :

```bash
# Test rapide
node scripts/notion-diagnostic.js

# Si databases trouvées > 0, alors :
npm run notion:test
```

## ⚠️ ERREURS COMMUNES

### "Databases trouvées: 0"
→ L'intégration n'a pas accès
→ Solution : Refaire le partage

### "object_not_found"
→ Database non partagée ou ID incorrect
→ Solution : Vérifier le partage et l'ID

### "unauthorized"
→ Token invalide
→ Solution : Recréer l'intégration

## 💡 ASTUCE IMPORTANTE

**L'intégration doit être invitée comme un "membre" de la page/database, pas seulement "connectée".**

C'est comme inviter un collaborateur : il faut explicitement lui donner accès via "Share" → "Invite".

## 🎯 UNE FOIS CONNECTÉ

Vous pourrez :
- `npm run notion:init` - Initialiser le projet Windventure
- `npm run notion:create` - Créer de nouveaux projets
- `npm run notion:report` - Générer des rapports
- Automatiser votre workflow Claude ↔ Notion

## 📞 BESOIN D'AIDE ?

Si le partage ne fonctionne pas :
1. Vérifiez que vous êtes admin/propriétaire de la page
2. Essayez de créer une nouvelle database de test
3. Vérifiez les permissions de l'intégration sur my-integrations