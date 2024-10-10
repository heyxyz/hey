# Hey Monorepo

## Requirements

- [Node.js](https://nodejs.org/en/download/) (v18 or higher)
- [pnpm](https://pnpm.io/installation)
- [Postgres App](https://postgresapp.com/)
- [Redis](https://redis.io/download)

## Installation

We use [pnpm workspaces](https://pnpm.io/workspaces) to efficiently manage our monorepo.

### Clone the repository

To gain access to the repository on Pierre, contact Yoginth and share your innovative ideas—together, let's build the future of the web.

```bash
git clone git@git.pierre.co:/repos/hey/hey.git
```

### Install NVM (Node Version Manager) and pnpm

If you're on macOS, you can install both with Homebrew:

```bash
brew install nvm pnpm
```

### Install Node.js

Use `nvm` to install the required version of Node.js:

```bash
nvm install
```

### Install dependencies

Navigate to the root of the repository and install all dependencies:

```bash
pnpm install
```

### Create a `.env` file

Copy the `.env.example` file to create a `.env` file in all relevant packages and apps, and fill in the necessary environment variables:

```bash
cp .env.example .env
```

Ensure to repeat this step for all packages and apps that require an `.env` file.

### Start the application

Once everything is set up, run the application in development mode:

```bash
pnpm dev
```

## Build and Test

### Build the application

To build the application, run:

```bash
pnpm build
```

### Test the application

For running tests in development mode:

```bash
pnpm test:dev
```

## Periodic Tasks

### Remove unused exports and helpers

We use `ts-prune` to find unused exports and helpers from the codebase. Note that this task should be run manually on individual packages and apps.

```bash
cd apps/web; npx ts-prune -i generated.ts
```

### Update dependencies

We use `pnpm` to update dependencies.

```bash
script/clean-branches
script/update-dependencies
```

### Update lock file

We use `pnpm` to update the lock file.

```bash
script/clean-branches
script/update-lock-file
```

## GitHub Mirror

Our repositories are managed using [Pierre](https://pierre.co/). You can find our mirrored repository on GitHub [here](https://github.com/heyxyz/hey). Although we do not accept pull requests (PRs) on GitHub, we encourage you to open issues.

## Other tools you might like

### Ripgrep

We use [Ripgrep](https://github.com/BurntSushi/ripgrep) to search for text in the codebase. It's like `grep` and `ag` had a baby, and that baby grew up to be a speed demon!

Install it via Homebrew:

```bash
brew install ripgrep
```

Search for text in the codebase:

```bash
rg "const Verified"
```

### Bundle Analyzer

In `apps/web`, we have a bundle analyzer available to view detailed information about the size and contents of our production bundles.

To generate this output, run:

```bash
ANALYZE=true pnpm build
```

Running this command will build the `apps/web` project and open three browser windows displaying bundle information for node, edge, and client bundles. The client bundle is crucial for page performance, while all bundles are important for development and build performance.

## Code of Conduct

We have a [code of conduct](./CODE_OF_CONDUCT.md) that we expect all contributors and team members to adhere to.

## License

This project is licensed under the **AGPL-3.0** license. See the [LICENSE](./LICENSE) file for more details.

🌸
