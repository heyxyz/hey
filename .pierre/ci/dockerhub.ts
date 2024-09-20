import { run } from "pierre";

export const label = "Deploy to Docker Hub";

const deployApi = async () => {
  const image = "heyxyz/api:latest";
  await run("docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_TOKEN");
  await run(`docker build -t ${image} -f ./apps/api/Dockerfile .`);
  await run(`docker push ${image}`);
};

export default [deployApi];
