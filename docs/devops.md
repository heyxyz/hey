# DevOps

```bash
pnpm install
```

## Build hey-api image

```bash
pnpm docker:build-api
```

## Build hey-web image

```bash
pnpm docker:build-web
```

## Create network

```bash
docker network hey_network
```

## Run hey-api and hey-web with docker-compose

```bash
docker-compose up -d
```
