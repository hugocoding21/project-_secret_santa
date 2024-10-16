# Étape 1 : Build de l'application Angular
FROM node:18 as build

WORKDIR /usr/src/app

# Copier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet Angular
COPY ./ /usr/src/app

# Construire l'application Angular pour la production
RUN npm run build --prod

# Étape 2 : Configuration de Nginx pour servir l'application Angular
FROM nginx:latest

# Copier les fichiers construits vers Nginx
COPY --from=build /usr/src/app/dist/frontend /usr/share/nginx/html

# Exposer le port 80 pour accéder à l'application Angular via Nginx
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
