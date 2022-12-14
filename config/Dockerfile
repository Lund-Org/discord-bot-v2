FROM node:19.2.0-slim

RUN apt-get update

RUN apt-get -y install curl jq wget lsb-release iputils-ping

WORKDIR /src/app

COPY apps ./apps
COPY libs ./libs
COPY scripts ./scripts
COPY package.json package-lock.json nx.json babel.config.json .env tsconfig.base.json ./

RUN npm i

RUN npx nx run prisma:generate

RUN mkdir dist

RUN ./scripts/build-prod.sh

# RUN npx nx run card-generator:build
# RUN npx nx run lundprod:build:production
# RUN npx nx run bot:build:production

ENTRYPOINT ["tail", "-f", "/dev/null"]
