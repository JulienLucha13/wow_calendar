# 🎮 Calendrier WoW

Un calendrier collaboratif pour organiser les disponibilités de votre équipe WoW, développé avec Next.js et Vercel KV.

## ✨ Fonctionnalités

### 📅 **Calendrier intelligent**

- Affichage de la semaine actuelle et de la semaine suivante
- Semaine commençant le lundi (convention européenne)
- Interface moderne et responsive

### 👥 **Gestion multi-utilisateurs**

- **Flavio** (bleu) - **Dagreat** (jaune) - **Aisen** (rose) - **Naarz** (violet)
- Sélection d'utilisateur via radio boutons colorés
- Sélection multiple par jour avec affichage divisé

### 🎯 **Sélection collaborative**

- Plusieurs utilisateurs peuvent sélectionner le même jour
- Affichage divisé en sections colorées selon le nombre de participants
- Seul l'utilisateur qui a ajouté sa couleur peut la retirer

### 💾 **Persistance des données**

- API REST avec Vercel KV pour la sauvegarde
- Synchronisation automatique en temps réel
- Données persistées globalement

## 🚀 Déploiement rapide

### 1. **Cloner le projet**

```bash
git clone https://github.com/JulienLucha13/wow_calendar.git
cd wow_calendar
```

### 2. **Installer les dépendances**

```bash
npm install
```

### 3. **Déployer sur Vercel**

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez votre compte GitHub
3. Importez le repository `wow_calendar`
4. Créez une base de données KV dans le dashboard Vercel
5. Déploiement automatique ! 🎉

## 🔧 Développement local

### **Option 1 : Avec Vercel CLI (Recommandé)**

```bash
# Installer Vercel CLI
npm i -g vercel

# Lier le projet
vercel link

# Récupérer les variables d'environnement
vercel env pull .env.local

# Démarrer en développement
npm run dev
```

### **Option 2 : Configuration manuelle**

1. Créez un fichier `.env.local` :

```env
KV_URL=your_kv_url_here
KV_REST_API_URL=your_kv_rest_api_url_here
KV_REST_API_TOKEN=your_kv_rest_api_token_here
KV_REST_API_READ_ONLY_TOKEN=your_kv_read_only_token_here
```

2. Démarrer l'application :

```bash
npm run dev
```

## 📊 API Endpoints

### **GET `/api/events`**

Récupère tous les événements du calendrier

```json
{
  "events": [
    {
      "date": "2024-01-15",
      "user": {
        "name": "Flavio",
        "color": "bg-blue-500"
      }
    }
  ]
}
```

### **POST `/api/events`**

Sauvegarde les événements du calendrier

```json
{
  "events": [
    {
      "date": "2024-01-15",
      "user": {
        "name": "Flavio",
        "color": "bg-blue-500"
      }
    }
  ]
}
```

## 🛠️ Technologies utilisées

- **Frontend** : Next.js 15, React 19, TypeScript
- **Styling** : Tailwind CSS 4
- **Base de données** : Vercel KV (Redis)
- **Déploiement** : Vercel
- **Versioning** : Git

## 📁 Structure du projet

```
src/
├── app/
│   ├── api/events/route.ts    # API REST
│   ├── page.tsx               # Page principale
│   └── layout.tsx             # Layout global
├── components/
│   └── Calendar.tsx           # Composant calendrier
└── hooks/
    └── useCalendarEvents.ts   # Hook personnalisé
```

## 🎯 Utilisation

1. **Sélectionner un utilisateur** en cliquant sur son radio bouton coloré
2. **Cliquer sur un jour** pour ajouter sa disponibilité
3. **Cliquer à nouveau** pour retirer sa disponibilité
4. **Voir les autres participants** dans les sections colorées divisées

## 🔍 Monitoring

- **Vercel Dashboard** : Surveillez l'utilisation de KV
- **Logs** : Consultez les logs d'API dans Vercel
- **Analytics** : Suivez les performances de votre application

## 🎮 Avantages

- ✅ **Gratuit** : Vercel KV offre 100MB de stockage gratuit
- ✅ **Global** : Données répliquées globalement
- ✅ **Rapide** : Latence ultra-faible
- ✅ **Simple** : Configuration automatique
- ✅ **Sécurisé** : Chiffrement en transit et au repos
- ✅ **Collaboratif** : Plusieurs utilisateurs simultanés

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

- Ouvrir une issue pour signaler un bug
- Proposer une nouvelle fonctionnalité
- Soumettre une pull request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Développé avec ❤️ pour la communauté WoW** 🐉⚔️
