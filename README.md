# Hey Monorepo

## Requirements

- [Node.js](https://nodejs.org/en/download/) (v20 or higher)
- [pnpm](https://pnpm.io/installation)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Redis](https://redis.io/download)

## Installation

We use [pnpm workspaces](https://pnpm.io/workspaces) to manage our monorepo.

### Clone the repository

Ping Yoginth for access to the repository on Pierre, make sure you have amazing ideas and you're ready to build the future of the web.

```bash
git clone git@git.pierre.co:/repos/hey/hey.git
```

### Install dependencies

```bash
pnpm install
```

### Create a `.env` file

Copy the `.env.example` file and rename it to `.env` in all possible packages and apps fill the required variables.

### Start the application

```bash
pnpm dev
```

### Build the application

```bash
pnpm build
```

### Test the application

```bash
pnpm test:dev
```
