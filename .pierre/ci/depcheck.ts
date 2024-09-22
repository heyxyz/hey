import { run } from "pierre";

export const label = "Check Dependencies";

export default async () => {
  await run("pnpm dep:check");
};
