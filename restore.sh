#!/bin/bash
CONTAINER_NAME="mongo"
DB_NAME="santa"

docker exec $CONTAINER_NAME mkdir dump
docker cp "backend/dump/users.bson" mongo:/dump/users.bson
docker cp "backend/dump/groups.bson" mongo:/dump/groups.bson

docker exec -i $CONTAINER_NAME mongorestore --db $DB_NAME --collection users dump/users.bson
docker exec -i $CONTAINER_NAME mongorestore --db $DB_NAME --collection groups dump/groups.bson

if [ $? -eq 0 ]; then
  echo "Restauration réussie !"
else
  echo "Erreur lors de la restauration."
  exit 1
fi
