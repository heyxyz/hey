import { run } from "pierre";

export const label = "Test";

const apiTest = async () => {
  const DATABASE_URL = process.env.TEST_DATABASE_URL as string;

  await run("cd packages/db && pnpm prisma:clean", {
    label: "Cleaning Test DB",
    env: { DATABASE_URL }
  });

  await run("cd packages/db && pnpm prisma:seed", {
    label: "Seeding Test DB",
    env: { DATABASE_URL }
  });

  await run("cd apps/api && pnpm dev &", {
    label: "Running API in background",
    env: { DATABASE_URL }
  });

  let attempts = 10;
  while (attempts > 0) {
    try {
      await run("curl http://localhost:4784/health", {
        label: "Checking API health"
      });
      console.log("API is healthy!");
      break;
    } catch {
      attempts--;
      console.log(`API not ready yet. Retrying... (${10 - attempts}/10)`);
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for 3 seconds before retrying
    }
  }

  if (attempts === 0) {
    throw new Error("API failed to start in the given time.");
  }

  await run("cd apps/api && pnpm test:dev", {
    label: "Running API tests",
    env: { DATABASE_URL }
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
