FROM node:18-alpine AS base
    RUN apk add --no-cache libc6-compat

FROM base AS builder
    WORKDIR /app

    RUN npm install -g turbo

    COPY . .

    RUN turbo prune --scope=@hey/og --docker

FROM base as installer
    WORKDIR /app

    RUN npm install -g pnpm
    RUN npm install -g turbo

    # First install dependencies (as they change less often)
    COPY .gitignore .gitignore
    COPY --from=builder /app/out/json/ .
    COPY --from=builder /app/out/full/ .
    COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
    RUN pnpm install

    # Build the project and its dependencies
    COPY turbo.json turbo.json

    # Uncomment and use build args to enable remote caching
    # ARG TURBO_TEAM
    # ENV TURBO_TEAM=$TURBO_TEAM

    # ARG TURBO_TOKEN
    # ENV TURBO_TOKEN=$TURBO_TOKEN

    RUN pnpm prettier:fix
    RUN turbo run build --filter=@hey/og...

FROM base AS runner
    WORKDIR /app

    RUN npm install -g pnpm

    # Don't run production as root
    RUN addgroup --system --gid 1001 nodejs
    RUN adduser --system --uid 1001 nextjs
    USER nextjs

    COPY --from=installer /app .

    CMD pnpm --filter @hey/og run start