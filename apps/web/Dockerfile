# Base image
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat

# Builder stage
FROM base AS builder
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=@hey/web --docker

# Installer stage
FROM base as installer
WORKDIR /app

RUN npm install -g pnpm
RUN npm install -g turbo

COPY .gitignore .gitignore
COPY prettier.config.js prettier.config.js
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/full/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder docker-entrypoint.sh /app/docker-entrypoint.sh
RUN pnpm install

COPY turbo.json turbo.json

RUN turbo run build --filter=@hey/web...

# Runner stage
FROM base AS runner
WORKDIR /app

RUN npm install -g pnpm

RUN addgroup --system --gid 1001 hey
RUN adduser --system --uid 1001 web

USER web
COPY --from=installer /app .

# Expose the port
EXPOSE 4784

# Copy the custom entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Command to run the app
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pnpm", "--filter", "@hey/web", "run", "start"]
