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

# Pass runtime environment variables to the container
ENV NEXT_PUBLIC_IS_PRODUCTION=${NEXT_PUBLIC_IS_PRODUCTION}
ENV NEXT_PUBLIC_LENS_NETWORK=${NEXT_PUBLIC_LENS_NETWORK}
ENV NEXT_PUBLIC_OG_URL=${NEXT_PUBLIC_OG_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_THIRDWEB_TOKEN=${NEXT_PUBLIC_THIRDWEB_TOKEN}
ENV NEXT_PUBLIC_DECENT_API_KEY=${NEXT_PUBLIC_DECENT_API_KEY}
ENV NEXT_PUBLIC_OPENSEA_API_KEY=${NEXT_PUBLIC_OPENSEA_API_KEY}
ENV NEXT_PUBLIC_RARIBLE_API_KEY=${NEXT_PUBLIC_RARIBLE_API_KEY}

# Command to run the app
CMD ["pnpm", "--filter", "@hey/web", "run", "start"]
