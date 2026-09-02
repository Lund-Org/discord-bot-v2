#!/bin/bash
set -e

read -p "Current production version? " current_version
read -p "New version? " new_version
read -p "Delete previous version? (y/n) " delete_version

if docker ps | grep maurice; then
  docker rm $(docker stop $(docker ps -a --filter ancestor=maurice:$current_version --format="{{.ID}}"))
fi

if [ "$delete_version" =  "y" ]; then
  docker image rm maurice:$current_version
fi

docker run -it -d --name discord_bot --network maurice-network --restart always --env-file .env maurice:$new_version pnpm nx run bot:serve:production &&
docker run -it -d --name lundprod --network maurice-network --restart always -p 4200:4200 --env-file .env maurice:$new_version pnpm nx run lundprod:serve:production
