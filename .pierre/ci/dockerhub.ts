import { run } from "pierre";

export const label = "Deploy to Docker Hub";

const deployApi = async () => {
  const image = "heyxyz/api:latest";
  await run("curl -fsSL https://get.docker.com/rootless | sh");
  await run("export PATH=$HOME/bin:$PATH");
  await run("export DOCKER_HOST=unix://$XDG_RUNTIME_DIR/docker.sock");
  await run("dockerd --privileged &");
  await run("sleep 10");
  await run("docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_TOKEN");
  await run(`docker build -t ${image} -f ./apps/api/Dockerfile .`);
  await run(`docker push ${image}`);
};

export default [deployApi];
