# syntax=docker/dockerfile:1

# Production dependencies only. The Astro standalone server imports a few
# packages at runtime, so node_modules must ship with the built output.
FROM oven/bun:1.4.4 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production --ignore-scripts

FROM oven/bun:1.4.4 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --ignore-scripts
COPY . .
RUN bun run build

FROM node:26-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
	HOST=0.0.0.0 \
	PORT=4321

COPY package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

USER node
EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
