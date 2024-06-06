FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat

#--
FROM base AS builder
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=@good/api --docker
#--

#--
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

RUN turbo run build --filter=@good/api...
#--

#--
FROM base AS runner
WORKDIR /app

RUN npm install -g pnpm

RUN addgroup --system --gid 1001 good
RUN adduser --system --uid 1001 api

USER api
COPY --from=installer /app .

EXPOSE 4784
CMD pnpm --filter @good/api run start & pnpm --filter @good/api run cron
#--
