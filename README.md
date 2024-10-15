# Hey Monorepo

## Requirements

- [Node.js](https://nodejs.org/en/download/) (v18 or higher) - The backbone of our project, make sure you have this installed.
- [pnpm](https://pnpm.io/installation) - Our trusty package manager, because who doesn't love faster installs?
- [Postgres App](https://postgresapp.com/) - Our database of choice, because data needs a cozy home.
- [Redis](https://redis.io/download) - The speedy in-memory data store, for when you need things done in a flash.

## Installation

We harness the power of [pnpm workspaces](https://pnpm.io/workspaces) to keep our monorepo running smoother than a freshly buttered pancake.

### Clone the repository

Want to join the cool kids' club and access the repository on Pierre? Hit up Yoginth with your brilliant ideas—let's team up and create the web's next big thing!

```bash
git clone git@git.pierre.co:/repos/hey/hey.git
```

### Install NVM (Node Version Manager) and pnpm

Rocking a macOS? You can grab both with Homebrew, like a true brew master:

```bash
brew install nvm pnpm
```

### Install Node.js

Use `nvm` to summon the magical version of Node.js you need:

```bash
nvm install
```

### Install dependencies

Teleport yourself to the root of the repository and let pnpm sprinkle its dependency magic:

```bash
pnpm install
```

### Create a `.env` file

Channel your inner wizard and conjure up a `.env` file from the `.env.example` template for every package and app that needs it. Don't forget to sprinkle in the necessary environment variables!

```bash
cp .env.example .env
```

Don't forget to play copycat and repeat this `.env` file creation for every package and app that needs it. Consistency is key!

### Start the application

When all the stars align and everything is in place, kick off the application in development mode:

```bash
pnpm dev
```

## Build and Test

### Build the application

Ready to build the application? Just run this command:

```bash
pnpm build
```

### Test the application

Want to run tests while you're developing? Here's how you do it:

```bash
pnpm test
```

## Periodic Tasks

### Remove unused exports and helpers

We use `ts-prune` to hunt down and eliminate unused exports and helpers lurking in our codebase. Just a heads-up: you'll need to run this task manually for each package and app. Happy pruning!

```bash
cd apps/web; npx ts-prune -i generated.ts
```

### Update dependencies

Time to give our dependencies a makeover! We rely on the magical powers of `pnpm` to keep everything up-to-date and looking sharp.

```bash
script/clean-branches
script/update-dependencies
```

### Update lock file

We trust `pnpm` to keep our lock file fresh and fabulous!

```bash
script/clean-branches
script/update-lock-file
```

## GitHub Mirror

Our repositories are managed using [Pierre](https://pierre.co/). You can find our mirrored repository on GitHub [here](https://github.com/heyxyz/hey). Although we do not accept pull requests (PRs) on GitHub, we encourage you to open issues.

## Pierre

### Create Incremental Branch

This command will whip up a new incremental branch based on your current branch. It's like a clone, but cooler!

Imagine you're on the `feature/login` branch, and you run the command below. Voilà! A shiny new branch called `feature/login@2` will appear, like magic!

```bash
npx pierre@latest version
```

Need to create a new branch with the latest changes and a sprinkle of your own magic? This command's got your back! Perfect for when you want to dazzle us with your PR changes.

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

In `apps/web`, we've got a bundle analyzer that spills the beans on the size and contents of our production bundles. It's like having X-ray vision for your code!

To generate this output, run:

```bash
cd apps/web
ANALYZE=true pnpm build
```

Fire up this command to build the `apps/web` project and watch as three browser windows magically pop open, each showcasing bundle details for node, edge, and client bundles. The client bundle is the superhero for page performance, while all bundles play a vital role in development and build performance.

## Code of Conduct

We kindly ask all contributors and team members to follow our [Code of Conduct](./CODE_OF_CONDUCT.md). Think of it as our community's golden rulebook - play nice and keep the good vibes flowing!

## License

This project is open-sourced under the **AGPL-3.0** license. For all the nitty-gritty details, check out the [LICENSE](./LICENSE) file. It's a real page-turner!

## P.S

We 💖 you to the moon and back! Your support is like a never-ending supply of coffee for our code. Thank you for making Hey the most awesome place in the universe!

🌸
