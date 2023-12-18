FROM node:18-alpine AS base
  RUN apk add --no-cache libc6-compat

FROM base AS builder
    WORKDIR /app

    RUN npm install -g turbo

    COPY . .

    RUN turbo prune --scope=@hey/web --docker

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

    COPY turbo.json turbo.json

    # Uncomment and use build args to enable remote caching
    # ARG TURBO_TEAM
    # ENV TURBO_TEAM=$TURBO_TEAM

    # ARG TURBO_TOKEN
    # ENV TURBO_TOKEN=$TURBO_TOKEN

    RUN pnpm prettier:fix
    RUN turbo run build --filter=@hey/web...

FROM base AS runner
    WORKDIR /app

    RUN npm install -g pnpm

    ENV NEXT_PUBLIC_LENS_NETWORK="testnet" \
        DATABASE_URL="" \
        CLICKHOUSE_PASSWORD="" \
        SECRET="supersecret" \
        LIVEPEER_API_KEY="" \
        EVER_ACCESS_KEY="" \
        EVER_ACCESS_SECRET="" \
        LENS_IPFS_AUTH_KEY="" \
        IPAPI_KEY="" \
        GOOGLE_API_KEY="" \
        IRYS_PRIVATE_KEY="" \
        IMAGEKIT_URL="" \
        ZENDESK_API_KEY=""

    # Don't run production as root
    RUN addgroup --system --gid 1001 nodejs
    RUN adduser --system --uid 1001 nextjs

    USER nextjs

    COPY --from=installer /app .

    CMD pnpm --filter @hey/web run start