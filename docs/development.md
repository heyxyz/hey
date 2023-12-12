# Development

## Setup

### Install dependencies

```bash
pnpm install
```

### Setup environment variables

Run this on both web and api directories.

```bash
cp .env.example .env
```

### Run the development server

```bash
pnpm dev
```

### Run the production server

```bash
pnpm build
pnpm start
```

## Create a Lens account for development

1. Make sure your local env is pointed to testnet.
2. Open the Web app and click Login.
3. Connect with your browser wallet.
4. Click the "Create a testnet account" button.
5. Fill in the form and click "Sign up".
6. Once account is created, click Login to continue.
