import { run } from "pierre";

export const label = "Run Test";

export default async () => {
  await run("pnpm build");
  await run("pnpm test:dev");
};
