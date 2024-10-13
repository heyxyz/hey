import { run } from "pierre";

export const label = "Test";

const apiTest = async () => {
  const DATABASE_URL = process.env.TEST_DATABASE_URL as string;

  await run("cd packages/db && pnpm redis:flush", {
    label: "Flushing Test Redis"
  });

  await run("cd packages/db && pnpm prisma:seed", {
    label: "Seeding Test DB",
    env: { DATABASE_URL }
  });

  await run("cd apps/api && pnpm test", {
    label: "Running API tests",
    env: { DATABASE_URL }
  });
};

const ogTest = async () => {
  await run("cd apps/og && pnpm test", {
    label: "Running OG tests"
  });
};

const webTest = async () => {
  await run("cd apps/web && pnpm test", {
    label: "Running Web tests"
  });
};

const dataTest = async () => {
  await run("cd packages/data && pnpm test", {
    label: "Running Data tests"
  });
};

const helpersTest = async () => {
  await run("cd packages/helpers && pnpm test", {
    label: "Running Helpers tests"
  });
};

export default [apiTest, ogTest, webTest, dataTest, helpersTest];
