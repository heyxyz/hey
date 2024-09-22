import { run } from "pierre";

export const label = "Run DB Migration";

export default async () => {
  await run("cd packages/db && pnpm prisma:migrate");
};
