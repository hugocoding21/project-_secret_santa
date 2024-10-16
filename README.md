# Projet Secret Santa

## Description

Le projet **Secret Santa** est une application web permettant aux utilisateurs de participer à un échange de cadeaux sous forme de "Secret Santa". Les utilisateurs peuvent s'inscrire, créer des groupes d'échange et être assignés à un autre participant de manière aléatoire pour offrir un cadeau. Cette application utilise Node.js pour le backend et MongoDB pour la base de données.

## Technologie utilisé

**Client:** Angular

**Server:** Node, Express, MongoDB

**Docker**

## Prérequis

Avant de lancer l'application, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- [MongoDB](https://www.mongodb.com/try/download/community) (ou utilisez Docker pour le lancer)

## Lancer l'application en local

1. Clonez ce dépôt sur votre machine :
   ```bash
   git clone <URL_DU_DEPOT>
   cd <NOM_DU_REPO>
   ```
2. Créer un fichier .env à partir du env.sample et le compléter.
3. Lancer la commande :

```bash
npm run start
```

## Lancer l'application avec Docker

Pour simplifier le processus de démarrage de l'application et de sa base de données, vous pouvez utiliser Docker. Voici comment faire :

### Prérequis

Assurez-vous d'avoir [Docker](https://www.docker.com/products/docker-desktop) et [Docker Compose](https://docs.docker.com/compose/install/) installés sur votre machine.

### Instructions

1. Clonez ce dépôt sur votre machine (si ce n'est pas déjà fait) :
   ```bash
   git clone <URL_DU_DEPOT>
   cd <NOM_DU_REPO>
   ```
2. Créer un fichier .env à partir du env.sample et le compléter.
3. Lancer la commande :

```bash
docker-compose up --build
```
