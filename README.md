# Coloc-Factures

Application de gestion des dépenses partagées pour colocataires. Permet de suivre les dépenses communes, gérer les remboursements et calculer les soldes entre membres d'un groupe.

## Fonctionnalités

- **Authentification** : Inscription, connexion et gestion de profil
- **Groupes** : Création de groupes avec système d'invitation par code
- **Dépenses** : Ajout de dépenses avec répartition flexible (égale, pourcentage, montants exacts)
- **Catégories** : Eau, électricité, gaz, assurance habitation, autres
- **Soldes** : Calcul automatique des dettes entre membres
- **Paiements** : Enregistrement et confirmation des remboursements
- **Statistiques** : Graphiques par catégorie, mois et membre
- **Notifications** : Support des notifications push web

## Stack technique

**Frontend**
- Vue 3 (Composition API)
- Vite
- Pinia (state management)
- TailwindCSS
- Chart.js

**Backend**
- Node.js / Express
- Sequelize ORM
- SQLite3
- JWT (authentification)

## Getting Started

### Prérequis

- Node.js >= 18.0.0
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone <repo-url>
cd coloc-factures

# Installer les dépendances (client et serveur)
npm install
```

### Configuration

Créer un fichier `.env` à la racine du projet :

```env
# Serveur
PORT=3000
NODE_ENV=development

# JWT (important : utiliser une clé forte en production)
JWT_SECRET=votre-cle-secrete-a-changer
JWT_EXPIRES_IN=7d

# Base de données
DATABASE_PATH=./database/database.sqlite

# Email (optionnel)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=votre-email@example.com
SMTP_PASS=votre-mot-de-passe
EMAIL_FROM=noreply@coloc-factures.com

# Notifications push (optionnel)
# Générer avec : npx web-push generate-vapid-keys
VAPID_PUBLIC_KEY=votre-cle-publique
VAPID_PRIVATE_KEY=votre-cle-privee
VAPID_EMAIL=mailto:votre-email@example.com

# URL frontend (pour CORS)
FRONTEND_URL=http://localhost:5173
```

### Lancement en développement

```bash
# Lancer le client et le serveur simultanément
npm run dev
```

- Frontend : http://localhost:5173
- Backend : http://localhost:3000

### Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le client et le serveur en mode développement |
| `npm run dev:client` | Lance uniquement le frontend |
| `npm run dev:server` | Lance uniquement le backend |
| `npm run build` | Build de production du frontend |
| `npm start` | Démarre le serveur en production |
| `npm run lint` | Vérifie le code avec Biome |
| `npm run lint:fix` | Corrige automatiquement les erreurs de lint |
| `npm run format` | Formate le code |

## Structure du projet

```
coloc-factures/
├── client/                 # Frontend Vue.js
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── views/         # Pages (Login, Dashboard, Groups, etc.)
│   │   ├── stores/        # State Pinia (auth, groups, expenses)
│   │   ├── router/        # Configuration Vue Router
│   │   └── services/      # Client API (axios)
│   └── ...
├── server/                 # Backend Express
│   ├── config/            # Configuration (database, auth)
│   ├── models/            # Modèles Sequelize
│   ├── controllers/       # Contrôleurs des routes
│   ├── routes/            # Définition des routes API
│   ├── middleware/        # Middleware (auth, validation)
│   └── services/          # Services métier
├── docker/                 # Configuration Docker
├── Dockerfile             # Build multi-stage
└── package.json           # Configuration monorepo
```

## API

### Authentification (`/api/auth`)
- `POST /register` - Inscription
- `POST /login` - Connexion
- `GET /me` - Profil utilisateur
- `PUT /me` - Mise à jour du profil
- `PUT /me/password` - Changement de mot de passe

### Groupes (`/api/groups`)
- `GET /` - Liste des groupes
- `POST /` - Créer un groupe
- `GET /:id` - Détails d'un groupe
- `POST /join` - Rejoindre via code d'invitation
- `GET /:id/members` - Liste des membres

### Dépenses (`/api/groups/:groupId/expenses`)
- `GET /` - Liste des dépenses
- `POST /` - Ajouter une dépense
- `PUT /:id` - Modifier une dépense
- `DELETE /:id` - Supprimer une dépense

### Soldes et paiements (`/api/groups/:groupId`)
- `GET /balances` - Soldes des membres
- `GET /debts` - Structure des dettes simplifiée
- `POST /payments` - Enregistrer un paiement

### Statistiques (`/api/groups/:groupId/statistics`)
- `GET /` - Statistiques globales
- `GET /by-category` - Par catégorie
- `GET /by-month` - Par mois
- `GET /by-member` - Par membre

## Déploiement

### Docker

```bash
# Construire l'image
docker build -t coloc-factures .

# Lancer avec Docker Compose
docker-compose up
```

### Railway

Le projet est configuré pour Railway via `railway.toml`. Le health check utilise l'endpoint `/api/health`.

## Licence

MIT
