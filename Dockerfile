# syntax=docker/dockerfile:1

# Build stage
FROM node:26-bookworm-slim AS build

WORKDIR /app

RUN npm install -g pnpm@12

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src/ src/

RUN pnpm build

# Production dependencies stage
FROM node:26-bookworm-slim AS prod-deps

WORKDIR /app

RUN npm install -g pnpm@12

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

# Runtime stage
FROM node:26-bookworm-slim AS runtime

ENV NODE_ENV=production
ENV PORT=12000

WORKDIR /app

COPY --from=prod-deps --chown=node:node \
    /app/node_modules ./node_modules

COPY --from=build --chown=node:node \
    /app/dist ./dist

COPY --chown=node:node package.json ./

USER node

EXPOSE 12000

CMD ["node", "dist/main.js"]
