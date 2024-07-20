# Base image
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat

# Builder stage
FROM base AS builder
WORKDIR /app
RUN npm install -g turbo
COPY . .

# Installer stage
FROM base AS installer
WORKDIR /app

RUN npm install -g pnpm turbo

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/full/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

COPY turbo.json turbo.json

RUN turbo run build --filter=@hey/api...

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
