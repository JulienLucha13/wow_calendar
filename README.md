# 🎮 Calendrier WoW

Un calendrier collaboratif pour organiser les disponibilités de votre équipe WoW, développé avec Next.js et Neon PostgreSQL.

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

- Base de données PostgreSQL avec Neon
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

### 3. **Configurer Neon PostgreSQL**

1. Créez une base de données sur [neon.tech](https://neon.tech)
2. Nommez-la `neon-wow-calendar`
3. Copiez l'URL de connexion

### 4. **Déployer sur Vercel**

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez votre compte GitHub
3. Importez le repository `wow_calendar`
4. Ajoutez la variable d'environnement `DATABASE_URL` avec votre URL Neon
5. Déploiement automatique ! 🎉

## 🔧 Développement local

### **Option 1 : Avec Vercel CLI (Recommandé)**

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

1. Créez un fichier `.env.local` :

```env
DATABASE_URL=postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
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
- **Base de données** : Neon PostgreSQL
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
├── hooks/
│   └── useCalendarEvents.ts   # Hook personnalisé
└── lib/
    └── db.ts                  # Configuration base de données
```

## 🎯 Utilisation

1. **Sélectionner un utilisateur** en cliquant sur son radio bouton coloré
2. **Cliquer sur un jour** pour ajouter sa disponibilité
3. **Cliquer à nouveau** pour retirer sa disponibilité
4. **Voir les autres participants** dans les sections colorées divisées

## 🔍 Monitoring

- **Neon Dashboard** : Surveillez l'utilisation de votre base de données
- **Vercel Dashboard** : Surveillez les performances de votre application
- **Logs** : Consultez les logs d'API dans Vercel

## 🎮 Avantages

- ✅ **Gratuit** : Neon offre 3GB de stockage gratuit
- ✅ **PostgreSQL** : Base de données relationnelle robuste
- ✅ **Serverless** : Pas de gestion d'infrastructure
- ✅ **Global** : Réplication automatique
- ✅ **Rapide** : Latence ultra-faible
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
