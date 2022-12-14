npx nx run card-generator:build && \
  npx nx run proxy:build:development && \
  npx nx run lundprod:build:development && \
  npx nx run bot:build:development
