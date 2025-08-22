# 🔧 RÉSOLUTION ERREUR NOTION - "Validation failed for 3 parameter(s)"

## ❌ **ERREUR IDENTIFIÉE**

```
notion The operation failed with an error. 
Validation failed for 3 parameter(s).
```

Cette erreur indique que 3 champs dans le module Notion ont des valeurs incorrectes ou manquantes.

## 🔍 **CAUSES PRINCIPALES**

### 1️⃣ **Champs Date mal formatés**
```yaml
❌ INCORRECT:
Date Arrivée: {{1.checkin}}

✅ CORRECT:
Date Arrivée: {{parseDate(1.checkin; "YYYY-MM-DD")}}
```

### 2️⃣ **Champs obligatoires manquants**
```yaml
❌ Le champ "Client" (Title) est vide
❌ Des champs "Required" dans Notion ne sont pas mappés
❌ Variables inexistantes ({{1.variable_qui_existe_pas}})
```

### 3️⃣ **Types de données incorrects**
```yaml
❌ Number envoyé comme String
❌ Array envoyé pour un champ Select
❌ Valeur Select qui n'existe pas dans Notion
```

## ✅ **SOLUTIONS ÉTAPE PAR ÉTAPE**

### **ÉTAPE 1: VÉRIFIER LA CONNEXION NOTION**

1. Dans le module Notion Make.com :
   - Cliquez sur "Connection"
   - Vérifiez que la connexion est **ACTIVE** (icône verte)
   - Si rouge : Re-créez la connexion

2. Permissions Notion :
   - Allez dans Notion > Settings & Members > My connections
   - Vérifiez que "Make" a accès à votre base "WindVenture"

### **ÉTAPE 2: CORRIGER LE MAPPING DES CHAMPS**

Remappez **TOUS** les champs avec ces valeurs exactes :

```yaml
# CHAMPS OBLIGATOIRES (ne jamais laisser vide)
Client (Title): {{ifempty(1.name; "Client sans nom")}}
Email: {{ifempty(1.email; "email@example.com")}}

# CHAMPS DATE (utiliser parseDate)
Date Arrivée: {{parseDate(ifempty(1.checkin; "2025-06-01"); "YYYY-MM-DD")}}
Date Réservation: {{now}}

# CHAMPS NUMBER (utiliser parseNumber)
Nb Personnes: {{parseNumber(ifempty(1.participants; 1))}}

# CHAMPS SELECT (valeur exacte de Notion)
Package: {{ifempty(1.package; "Package non défini")}}
Niveau Kitesurf: {{ifempty(1.level; "Débutant")}}
Statut Réservation: "⏳ EN ATTENTE"
Statut Paiement: "En attente"
Source Réservation: "Site web"

# CHAMPS OPTIONNELS
Téléphone: {{ifempty(1.phone; "Non renseigné")}}
Notes & Commentaires: {{ifempty(1.notes; "Aucune note")}}
Hébergement: {{ifempty(1.accommodation; "À définir")}}

# CHAMPS MULTI-SELECT
Services Extra: {{ifempty(1.services; emptyarray)}}
```

### **ÉTAPE 3: VALIDATION DES CHAMPS NOTION**

Vérifiez dans votre base Notion que :

1. **Tous les champs existent** avec les noms exactes
2. **Types de champs corrects** :
   - Client → Title
   - Email → Email  
   - Date Arrivée → Date
   - Nb Personnes → Number
   - Package → Select
   - Services Extra → Multi-select

3. **Options Select disponibles** :
   - Package : vérifiez que "⭐ COMBINED PACKAGE" existe
   - Niveau : vérifiez que "Débutant", "Intermédiaire" existent
   - Statut : vérifiez que "⏳ EN ATTENTE" existe

### **ÉTAPE 4: DÉBOGAGE AVANCÉ**

Si l'erreur persiste, ajoutez un module **"Set Variables"** avant Notion :

```yaml
Module: Tools > Set multiple variables

Variables à définir:
safe_name: {{ifempty(1.name; "Test Client")}}
safe_email: {{ifempty(1.email; "test@windventure.fr")}}
safe_checkin: {{ifempty(1.checkin; "2025-06-01")}}
safe_participants: {{parseNumber(ifempty(1.participants; 1))}}
safe_package: {{ifempty(1.package; "Beginner Private")}}
safe_level: {{ifempty(1.level; "Débutant")}}
```

Puis utilisez ces variables sécurisées dans Notion :
```yaml
Client: {{safe_name}}
Email: {{safe_email}}
Date Arrivée: {{parseDate(safe_checkin; "YYYY-MM-DD")}}
etc...
```

## 🧪 **TEST DE VALIDATION**

1. **Données test minimales** pour identifier le problème :

```javascript
{
  "name": "Test Debug",
  "email": "test@example.com",
  "phone": "+33600000000",
  "package": "Test Package",
  "checkin": "2025-06-01",
  "participants": 1,
  "level": "Débutant",
  "accommodation": "Test",
  "services": [],
  "notes": "Test debug",
  "source": "Test"
}
```

2. **Testez chaque champ individuellement** :
   - Mappez d'abord seulement "Client" et "Email"
   - Si ça marche, ajoutez les autres un par un
   - Identifiez quel champ cause l'erreur

## 🔧 **SOLUTIONS SPÉCIFIQUES PAR ERREUR**

### **Si erreur sur les DATES :**
```yaml
# Au lieu de:
Date Arrivée: {{1.checkin}}

# Utilisez:
Date Arrivée: {{parseDate(1.checkin; "YYYY-MM-DD")}}
Date Réservation: {{now}}
```

### **Si erreur sur les NUMBERS :**
```yaml
# Au lieu de:
Nb Personnes: {{1.participants}}

# Utilisez:
Nb Personnes: {{parseNumber(1.participants)}}
```

### **Si erreur sur les SELECT :**
```yaml
# Vérifiez que les valeurs existent dans Notion
# Utilisez des valeurs par défaut:
Package: {{switch(1.package; "combined"; "⭐ COMBINED PACKAGE"; "beginner-private"; "🟢 BEGINNER PRIVATE"; "Package non défini")}}
```

## 📞 **AIDE URGENTE**

Si le problème persiste :

1. **Screenshot** de l'erreur Make.com
2. **Liste** des champs de votre base Notion
3. **Configuration** actuelle du module Notion

**L'erreur sera résolue avec le bon mapping !** 🎯