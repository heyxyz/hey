FROM node:lts-bookworm-slim AS BASE
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS pruner
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install -g turbo
RUN turbo prune --docker --scope "@workers/feeds" --scope "@workers/invite" --scope "@workers/metadata" --scope "@workers/preferences" --scope "@workers/staff-picks" --scope "@workers/achievements" --scope "@workers/freshdesk" --scope "@workers/leafwatch" --scope "@workers/nft" --scope "@workers/prerender" --scope "@workers/sts" --scope "@workers/ens" --scope "@workers/groups" --scope "@workers/live" --scope "@workers/oembed" --scope "@workers/snapshot-relay"

FROM base AS installer
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS runner
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates

RUN update-ca-certificates

COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .

CMD pnpm dev