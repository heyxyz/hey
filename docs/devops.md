# DevOps

### Setup environment variables

Run this on both web, api, and og directories.

```bash
cp .env.example .env
```

### Build hey-api image

```bash
pnpm docker:build-api
```

### Build hey-web image

```bash
pnpm docker:build-web
```

### Build hey-og image

```bash
pnpm docker:build-og
```

### Create hey network

```bash
pnpm docker:network
```


### Deploy hey

```bash
pnpm docker:deploy
```