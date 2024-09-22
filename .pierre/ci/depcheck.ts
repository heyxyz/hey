import { run } from "pierre";

export const label = "Run Dependency Check";

export default async () => {
  await run("pnpm dep:check");
};
