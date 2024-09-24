import { run } from "pierre";

export const label = "Migrate DB";

export default async ({ branch }) => {
  if (branch.name !== "main") {
    throw new Error("Skipping DB Migration on non-main branches 🚫");
  }

  await run("cd packages/db && pnpm prisma:migrate");
};
