npx nx run card-generator:build && \
  npx nx run proxy:build:production && \
  npx nx run lundprod:build:production && \
  npx nx run bot:build:production
