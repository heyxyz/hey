import { Icons, annotate, run } from "pierre";

export const label = "Migrate DB";

const migrateProductionDb = async ({ branch }) => {
  if (branch.name !== "main") {
    await run('echo "Skipping DB Migration on non-main branches 🚫"', {
      label: "Skipping DB Migration"
    });

    annotate({
      color: "fg",
      label: "Skipped Production DB Migration",
      icon: Icons.Table
    });
  } else {
    await run("cd packages/db && pnpm prisma:migrate", {
      label: "Migrating Production DB",
      env: { DATABASE_URL: process.env.PRODUCTION_DATABASE_URL as string }
    });
  }
};

const migrateTestDb = async () => {
  await run("cd packages/db && pnpm prisma:migrate", {
    label: "Migrating Test DB",
    env: { DATABASE_URL: process.env.TEST_DATABASE_URL as string }
  });

  annotate({
    color: "fg",
    label: "Test DB Migration Complete",
    icon: Icons.Table
  });
};

export default [migrateProductionDb, migrateTestDb];
