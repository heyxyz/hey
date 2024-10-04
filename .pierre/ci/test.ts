import { run } from "pierre";

export const label = "Test";

export default async () => {
  await run("pnpm test:dev", {
    label: "Running tests"
  });
};
