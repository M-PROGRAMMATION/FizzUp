# FizzUp

Monorepo Next.js et NestJS pour l'application FizzUp.

## 🚀 Démarrage rapide

### 1. Démarrer Docker (PostgreSQL, Redis, Adminer)

```bash
./scripts/docker-start.sh
```

Services disponibles :
- **PostgreSQL**: `localhost:35435`
- **Adminer**: http://localhost:38082
- **Redis**: `localhost:6379`
- **Redis Commander**: http://localhost:8081

### 2. Démarrer l'API (NestJS)

```bash
npx nx serve api
```

L'API sera disponible sur http://localhost:3000

### 3. Démarrer la Web App (Next.js)

```bash
npx nx serve web-app
```

L'application web sera disponible sur http://localhost:3000

## 📦 Scripts Docker disponibles

```bash
./scripts/docker-start.sh      # Démarrer les conteneurs
./scripts/docker-stop.sh       # Arrêter les conteneurs
./scripts/docker-restart.sh    # Redémarrer les conteneurs
./scripts/docker-status.sh     # Voir le statut
./scripts/docker-logs.sh       # Voir les logs
./scripts/docker-clean.sh      # Nettoyer tout (⚠️ supprime les données)
./scripts/check-ports.sh       # Vérifier les ports
```

## 🛠️ Commandes Nx utiles

```bash
# Voir tous les projets
npx nx show projects

# Voir les détails d'un projet
npx nx show project api
npx nx show project web-app

# Builder les applications
npx nx build api
npx nx build web-app

# Lancer les tests
npx nx test api
npx nx test web-app

# Visualiser le graphe des dépendances
npx nx graph
```
