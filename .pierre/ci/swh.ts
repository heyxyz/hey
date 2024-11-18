import { run } from "pierre";

export const label = "Save to Software Heritage";

export default async ({ branch }) => {
  if (branch.name !== "main") {
    await run('echo "Skipping SWH on non-main branches 🚫"', {
      label: "Skipping SWH"
    });
  } else {
    await fetch(
      "https://archive.softwareheritage.org/api/1/origin/save/git/url/https://github.com/heyxyz/hey",
      { method: "POST" }
    );
  }
};
