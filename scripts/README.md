# Scripts Docker

Collection de scripts pour gérer les conteneurs Docker du projet FizzUp.

## Scripts disponibles

### 🚀 `docker-start.sh`
Démarre tous les conteneurs Docker en mode détaché.

```bash
./scripts/docker-start.sh [env-file]
```

Exemples :
```bash
./scripts/docker-start.sh                    # Utilise .env.development par défaut
./scripts/docker-start.sh .env.production    # Utilise .env.production
```

### 🛑 `docker-stop.sh`
Arrête tous les conteneurs Docker.

```bash
./scripts/docker-stop.sh [env-file]
```

### 🔄 `docker-restart.sh`
Redémarre tous les conteneurs Docker.

```bash
./scripts/docker-restart.sh [env-file]
```

### 📋 `docker-logs.sh`
Affiche les logs des conteneurs en temps réel.

```bash
./scripts/docker-logs.sh [env-file] [service]
```

Exemples :
```bash
./scripts/docker-logs.sh                          # Tous les services
./scripts/docker-logs.sh .env.development fizzup_postgres    # Un service spécifique
```

### 📊 `docker-status.sh`
Affiche le statut de tous les conteneurs.

```bash
./scripts/docker-status.sh [env-file]
```

### 🧹 `docker-clean.sh`
Nettoie complètement les conteneurs et volumes (⚠️ supprime les données).

```bash
./scripts/docker-clean.sh [env-file]
```

### 🔍 `check-ports.sh`
Vérifie quels ports sont déjà utilisés.

```bash
./scripts/check-ports.sh
```

## Rendre les scripts exécutables

```bash
chmod +x scripts/*.sh
```

## Services disponibles

Après démarrage des conteneurs :

- **PostgreSQL**: `localhost:35435`
  - User: `fizzup_user`
  - Password: `fizzup_password`
  - Database: `fizzup_dev`

- **Adminer**: http://localhost:38082
  - Interface web pour gérer PostgreSQL

- **Redis**: `localhost:6379`

- **Redis Commander**: http://localhost:8081
  - User: `admin`
  - Password: `admin`
