import { run } from "pierre";

export const label = "Test";

const apiTest = async () => {
  await run("cd apps/api && pnpm test:dev", {
    label: "Running API tests",
    env: { DATABASE_URL: process.env.PRODUCTION_DATABASE_URL as string }
  });
};

const ogTest = async () => {
  await run("cd apps/og && pnpm test:dev", {
    label: "Running OG tests"
  });
};

const webTest = async () => {
  await run("cd apps/web && pnpm test:dev", {
    label: "Running Web tests"
  });
};

const dataTest = async () => {
  await run("cd packages/data && pnpm test:dev", {
    label: "Running Data tests"
  });
};

const helpersTest = async () => {
  await run("cd packages/helpers && pnpm test:dev", {
    label: "Running Helpers tests"
  });
};

export default [apiTest, ogTest, webTest, dataTest, helpersTest];
