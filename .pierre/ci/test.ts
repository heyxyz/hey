import { run } from "pierre";

export const label = "Test";

const apiTest = async () => {
  await run("cd apps/api && pnpm test:dev", {
    label: "Running API tests"
  });
};

const ogTest = async () => {
  await run("cd packages/og && pnpm test:dev", {
    label: "Running OG tests"
  });
};

const webTest = async () => {
  await run("cd apps/web && pnpm test:dev", {
    label: "Running web tests"
  });
};

const dataTest = async () => {
  await run("cd packages/data && pnpm test:dev", {
    label: "Running data tests"
  });
};

const helpersTest = async () => {
  await run("cd packages/helpers && pnpm test:dev", {
    label: "Running helpers tests"
  });
};

export default [apiTest, ogTest, webTest, dataTest, helpersTest];
