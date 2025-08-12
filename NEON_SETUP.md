# Configuration Neon PostgreSQL pour le Calendrier WoW

## 🚀 Configuration de Neon

### 1. Créer une base de données Neon

1. **Aller sur [neon.tech](https://neon.tech)**
2. **C'inscrire ou se connecter**
3. **Créer un nouveau projet** nommé `neon-wow-calendar`
4. **Noter les informations de connexion** fournies

### 2. Variables d'environnement

#### **Pour le développement local :**

Créez un fichier `.env.local` :

```env
DATABASE_URL=postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
```

#### **Pour Vercel :**

Dans le dashboard Vercel, ajoutez la variable d'environnement :

- **Nom** : `DATABASE_URL`
- **Valeur** : `postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require`

### 3. Structure de la base de données

La table `events` sera créée automatiquement avec la structure suivante :

```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  date VARCHAR(10) NOT NULL,
  user_name VARCHAR(50) NOT NULL,
  user_color VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date, user_name)
);
```

## 🔧 Développement local

### **Option 1 : Avec Vercel CLI**

```bash
# Installer Vercel CLI
npm i -g vercel

# Lier le projet
vercel link

# Ajouter la variable d'environnement
vercel env add DATABASE_URL

# Récupérer les variables d'environnement
vercel env pull .env.local

# Démarrer en développement
npm run dev
```

### **Option 2 : Configuration manuelle**

1. **Créer le fichier `.env.local`** avec votre URL de connexion Neon
2. **Démarrer l'application** :

```bash
npm run dev
```

## 📊 Avantages de Neon

- ✅ **Gratuit** : 3GB de stockage gratuit
- ✅ **PostgreSQL** : Base de données relationnelle robuste
- ✅ **Serverless** : Pas de gestion d'infrastructure
- ✅ **Global** : Réplication automatique
- ✅ **Rapide** : Latence ultra-faible
- ✅ **Sécurisé** : Chiffrement en transit et au repos

## 🔍 Monitoring

- **Neon Dashboard** : Surveillez l'utilisation de votre base de données
- **Logs** : Consultez les requêtes SQL dans Neon
- **Analytics** : Suivez les performances de votre base de données

## 🚀 Déploiement sur Vercel

1. **Pousser le code sur GitHub**
2. **Connecter le projet à Vercel**
3. **Ajouter la variable d'environnement `DATABASE_URL`** dans Vercel
4. **Déployer automatiquement**

## 📋 Fonctionnalités de la base de données

### **Opérations supportées :**

- ✅ **Création automatique de table** au premier accès
- ✅ **Ajout d'événements** avec gestion des doublons
- ✅ **Suppression d'événements** par utilisateur et date
- ✅ **Récupération de tous les événements** triés par date
- ✅ **Sauvegarde en masse** des événements

### **Contraintes :**

- **UNIQUE(date, user_name)** : Un utilisateur ne peut avoir qu'un événement par jour
- **Validation des données** : Vérification des types et formats
- **Gestion d'erreurs** : Retour d'erreurs explicites en cas de problème

## 🔧 Migration depuis Vercel KV

Si vous migrez depuis Vercel KV :

1. **Exporter les données** depuis Vercel KV
2. **Importer dans Neon** via l'API ou les scripts de migration
3. **Mettre à jour les variables d'environnement**
4. **Tester la migration** en développement

---

**Configuration Neon terminée ! Votre calendrier WoW est maintenant prêt avec PostgreSQL** 🐉⚔️
