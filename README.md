## AdaRemise

Application web pour La Remise, la ressourcerie associative. Elle permet aux bénévoles de s'identifier, d'enregistrer les dépôts et les objets, de suivre leur statut (arrivé → en réparation → en rayon → vendu / recyclé), et de consulter un tableau de bord (nombre d'objets par statut, poids total reçu, objets en rayon).

### Stack
- Base de données : PostgreSQL 16 (Docker)
- API : Node.js / Express / pg
- Front : React (Vite) / React Router

### Prérequis
- Node.js et npm
- Docker 

### Installation et lancement

```bash
# 1. Cloner le dépôt et installer les dépendances
git clone <url du repo>
cd Adaremise
npm install coter back && npm install cote front

# 2. Lancer la base de données (Postgres via Docker)
docker compose up -d

# 3. Lancer l'API et le front
npm run dev (dans le db/)
npm run dev (dans le front/)
```

L'application est ensuite accessible sur `http://localhost::5173`

### Variables d'environnement
Copier `.env.example` vers `.env` dans `api/` et `front/`, et renseigner les valeurs nécessaires (connexion PostgreSQL, ports, etc.).