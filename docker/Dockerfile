FROM node:lts-bookworm-slim 
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

ARG WORKSPACE

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates git

RUN update-ca-certificates

WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --filter=${WORKSPACE}

ENV WORKSPACE=${WORKSPACE}

CMD pnpm dev --filter=${WORKSPACE}