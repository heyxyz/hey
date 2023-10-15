# Setting up the development environment
## Native (recommended)
### Install dependencies

```bash
pnpm install
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


## Docker
First things first, you need Docker. If you don't have it already, you can get it from [here](https://docs.docker.com/get-docker/). We recommend using Docker Desktop, and we don't recommend using other runtimes such as [colima](https://github.com/abiosoft/colima).

### Launch
Now that you've got Docker, go to the root of our project, open your terminal and run:
```sh
bash scripts/run-dev.sh
```

This will launch three containers: `hey-web`, `hey-prerender` and `hey-workers`. The last one runs all the workers found in the `packages/workers/` directory. You can kill the containers with `CTRL/CMD+c`

Have a look at http://localhost:4783. You should find your local instance of hey there.


That's it! You're all set to start working on hey project. 🐳

### VSCode inside containers (optional)
While everything should be up and running at this point and any changes in code should be automatically reflected in your local version. 

You will notice that you're IDE will tell you don't have any dependencies installed. This is because you're installed inside of docker and invisible to your IDE.

While you can installed them locally as well, we do not recommend. Having one set of depedencies available to your IDE and a potentially different one for the runtime only spells trouble.  

Instead, we recommend, if you use VSCode, to attach it directly to your container.

https://code.visualstudio.com/docs/devcontainers/attach-container

### Caveats

#### One worker per container

If you're working on workers and want to run each one in its own container, you can do so with:
```sh
bash scripts/run-dev.sh --separate-workers
```

But be cautious - this will create over 15 containers, which might take some time to build, especially on older machines.

#### Alternative container configurations
If you want more control over which packages to run, you can use these arguments with the `run-dev.sh` script:

- `--only-apps` - To run only the apps.
- `--only-workers` - To run only the workers.

#### Docker compose argument forwarding
You can also use any docker compose arguments with the `run-dev.sh` script. These arguments are forwarded to the docker compose command that the script runs. For the full list of supported arguments, check:
```sh
docker compose --help
```

For example, if you want to do a dry-run of a rebuild for all containers, you can run:

```sh
bash scripts/run-dev.sh --separate-workers --build --dry-run
```


#### Out of disk space
If you ever run into errors related to running out of disk space with Docker, don't worry. You can clean things up by running this:
```sh
docker system prune
```