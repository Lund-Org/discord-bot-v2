FROM node:26-slim

ENV PNPM_HOME=/usr/local/bin
ARG PNPM_VERSION=10.18.3

RUN apt-get update

# add all the packages here you want to add
RUN apt-get -y install curl wget lsb-release build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
RUN npm i -g corepack
RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

RUN mkdir -p /usr/src/app

COPY package.json /usr/src/app
COPY pnpm-lock.yaml /usr/src/app
COPY pnpm-workspace.yaml /usr/src/app

WORKDIR /usr/src/app

RUN pnpm i

COPY apps/ /usr/src/app/apps/
COPY libs/ /usr/src/app/libs/
COPY package.json /usr/src/app
COPY public/ /usr/src/app/public/
COPY babel.config.json /usr/src/app
COPY tsconfig.base.json /usr/src/app
COPY nx.json /usr/src/app

RUN pnpm nx run prisma:generate

RUN pnpm nx run lundprod:build:production
RUN pnpm nx run bot:build:production
