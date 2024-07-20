# Base image
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat

# Installer stage
FROM base AS installer
WORKDIR /app

RUN npm install -g pnpm turbo
RUN turbo prune --scope=@hey/api --docker
RUN pnpm install

COPY turbo.json turbo.json

# Runner stage
FROM base AS runner
WORKDIR /app

RUN npm install -g pnpm
RUN addgroup --system --gid 1001 hey
RUN adduser --system --uid 1001 app

USER app
COPY --from=installer /app .

# Expose the port
EXPOSE 4784

# Command to run the app
CMD sleep 3 && pnpm --filter @hey/api run start
