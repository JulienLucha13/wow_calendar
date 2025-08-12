# Configuration Vercel KV pour le Calendrier WoW

## 🚀 Déploiement sur Vercel

### 1. Préparer le projet pour Vercel

1. **Pousser le code sur GitHub/GitLab**

```bash
git add .
git commit -m "Ajout de l'API avec Vercel KV"
git push origin master
```

2. **Connecter le projet à Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez votre compte GitHub/GitLab
   - Importez votre repository `wow_calendar`

### 2. Configurer Vercel KV

1. **Dans le dashboard Vercel :**

   - Allez dans votre projet
   - Cliquez sur "Storage" dans le menu
   - Sélectionnez "KV" et cliquez sur "Create Database"

2. **Variables d'environnement automatiques :**
   Vercel configurera automatiquement ces variables :
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

### 3. Déploiement

1. **Déployer automatiquement :**

   - Vercel détectera automatiquement que c'est un projet Next.js
   - Le déploiement se fera automatiquement à chaque push

2. **Vérifier le déploiement :**
   - Votre application sera disponible sur `https://votre-projet.vercel.app`
   - Les données seront persistées dans Vercel KV

## 🔧 Développement local

### Option 1 : Utiliser Vercel CLI (Recommandé)

1. **Installer Vercel CLI :**

```bash
npm i -g vercel
```

2. **Lier le projet :**

```bash
vercel link
```

3. **Puller les variables d'environnement :**

```bash
vercel env pull .env.local
```

4. **Démarrer en mode développement :**

```bash
npm run dev
```

### Option 2 : Configuration manuelle

1. **Créer un fichier `.env.local` :**

```env
KV_URL=your_kv_url_here
KV_REST_API_URL=your_kv_rest_api_url_here
KV_REST_API_TOKEN=your_kv_rest_api_token_here
KV_REST_API_READ_ONLY_TOKEN=your_kv_read_only_token_here
```

2. **Obtenir les valeurs depuis Vercel Dashboard :**
   - Allez dans votre projet Vercel
   - Storage > KV > Settings
   - Copiez les valeurs des variables d'environnement

## 📊 Fonctionnalités de l'API

### Endpoints disponibles :

- **GET `/api/events`** : Récupère tous les événements du calendrier
- **POST `/api/events`** : Sauvegarde les événements du calendrier

### Structure des données :

```typescript
interface DayEvent {
  date: string; // Format: "2024-01-15"
  user: {
    name: string; // "Flavio", "Dagreat", "Aisen", "Naarz"
    color: string; // "bg-blue-500", "bg-yellow-500", etc.
  };
}
```

## 🎯 Avantages de Vercel KV

- ✅ **Gratuit** : 100MB de stockage gratuit
- ✅ **Global** : Données répliquées globalement
- ✅ **Rapide** : Latence ultra-faible
- ✅ **Simple** : Configuration automatique
- ✅ **Sécurisé** : Chiffrement en transit et au repos

## 🔍 Monitoring

- **Vercel Dashboard** : Surveillez l'utilisation de KV
- **Logs** : Consultez les logs d'API dans Vercel
- **Analytics** : Suivez les performances de votre application
