export const label = "Vercel";
import { Icons, type JobContext, annotate, run } from "pierre";

const vercel = "./node_modules/.bin/vercel";

export interface VercelContext {
  VERCEL_ORG_ID: string;
  VERCEL_PROJECT_ID: string;
  VERCEL_SCOPE: string;
  VERCEL_PROJECT_NAME: string;
}

type VercelDeployment = {
  uid: string;
  url: string;
  inspectorUrl: string;
};

const Job =
  ({
    VERCEL_ORG_ID,
    VERCEL_PROJECT_ID,
    VERCEL_SCOPE,
    VERCEL_PROJECT_NAME
  }: VercelContext) =>
  async (ctx: JobContext) => {
    const isProd = ctx.branch.name === "main";
    const VERCEL_ACCESS_TOKEN = process.env.VERCEL_ACCESS_TOKEN;

    await run("rm -rf .pnpm-store");
    await run('echo "$PWD"');

    const { stdout } = await run(
      `${vercel} deploy --scope ${VERCEL_SCOPE} ${isProd ? "" : "--no-wait"} --yes ${
        isProd ? "--prod" : ""
      } --no-color --token $VERCEL_ACCESS_TOKEN -e PIERRE_BRANCH_ID=${
        ctx.branch.id
      } -e PIERRE_ENVIRONMENT=${isProd ? "production" : "preview"}`,
      {
        label: "Creating Vercel Deployment",
        env: {
          VERCEL_ORG_ID,
          VERCEL_PROJECT_ID
        }
      }
    );
    const previewURL = stdout
      .replace(/\r?\n|\r/g, " ") // try desperately to remove new lines
      .match(/https:\/\/[\w\n-]+\.vercel\.app/g)?.[0];

    if (previewURL) {
      annotate({
        icon: Icons.ArrowUpRightCircle,
        color: "fg",
        label: "Vercel Preview",
        description: previewURL,
        href: previewURL
      });

      try {
        const previewUrlNoScheme = previewURL.replace(/^https?:\/\//, "");

        const response = await fetch(
          `https://api.vercel.com/v6/deployments?slug=${VERCEL_SCOPE}&app=${VERCEL_PROJECT_NAME}`,
          {
            headers: {
              Authorization: `Bearer ${VERCEL_ACCESS_TOKEN}`
            },
            method: "get"
          }
        );

        const result: {
          deployments?: VercelDeployment[];
        } = await response.json();
        let activeDeploy: VercelDeployment | undefined;

        result?.deployments?.forEach((deployment) => {
          if (!activeDeploy && deployment.url === previewUrlNoScheme) {
            console.log("Deployment found: ", deployment.uid);
            activeDeploy = deployment;
          }
        });

        if (activeDeploy?.inspectorUrl) {
          annotate({
            icon: Icons.Code,
            color: "fg",
            label: "Vercel Build Details",
            description: activeDeploy.inspectorUrl,
            href: activeDeploy.inspectorUrl
          });
        } else {
          console.log("WARN: Failed to extract inspector URL");
        }
      } catch (e) {
        console.log(e);
        console.log(
          "WARN: Not-critical error thrown while trying to fetch inspector url."
        );
      }
    } else {
      console.log("WARN: Failed to extract preview URL");
    }

    // Now run the inspect with --wait and --logs so that we get log output and
    // wait for the build pass/fail
    const { exitCode } = await run(
      `${vercel} inspect ${previewURL} --scope ${VERCEL_SCOPE} --logs --wait --timeout=15m --no-color --token $VERCEL_ACCESS_TOKEN`,
      {
        label: "Vercel Deployment Build",
        env: {
          VERCEL_ORG_ID,
          VERCEL_PROJECT_ID
        }
      }
    );

    if (exitCode !== 0) {
      throw new Error("Vercel build failed");
    }
  };

export default Job({
  VERCEL_ORG_ID: "team_Zcr7s5jVtNqVKO8Q4w7Kcm9T",
  VERCEL_PROJECT_ID: "prj_qmnJU7f5coeKD7x2VF33EP46jTHq",
  VERCEL_SCOPE: "apps/web",
  VERCEL_PROJECT_NAME: "web"
});
