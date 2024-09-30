# Hey Monorepo

## Requirements

- [Node.js](https://nodejs.org/en/download/) (v20 or higher)
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

## GitHub Mirror

We manage our repositories using [Pierre](https://pierre.co/). You can view our mirrored repository on GitHub here. While we don't accept pull requests (PRs) on GitHub, you're welcome to open issues.

## License

This project is licensed under the AGPL-3.0 license. See the [LICENSE](./LICENSE) file for more details.
