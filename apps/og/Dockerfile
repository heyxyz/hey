# Base image
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat

# Builder stage
FROM base AS builder
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=@hey/og --docker

# Installer stage
FROM base as installer
WORKDIR /app

RUN npm install -g pnpm turbo

COPY .gitignore .gitignore
COPY prettier.config.js prettier.config.js
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/full/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

COPY turbo.json turbo.json

RUN turbo run build --filter=@hey/og...

# Runner stage
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 hey
RUN adduser --system --uid 1001 og

USER og
COPY --from=installer /app .

# Expose the port
EXPOSE 4785

# Command to run the app
CMD npm --filter @hey/og run start
