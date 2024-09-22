import { run } from "pierre";

export const label = "Run DB Migration";

export default async ({ branch }) => {
  if (branch.name !== "main") {
    await run('echo "Skipping DB Migration on non-main branches 🚫"');
  }

  await run("cd packages/db && pnpm prisma:migrate");
};
