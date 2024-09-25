import { Icons, type JobContext, annotate, run } from "pierre";

const vercel = "./node_modules/.bin/vercel";

export interface VercelContext {
  VERCEL_PROJECT_ID: string;
  PROJECT_NAME: string;
}

interface VercelDeployment {
  uid: string;
  url: string;
  inspectorUrl: string;
}

export const Job =
  ({ VERCEL_PROJECT_ID, PROJECT_NAME }: VercelContext) =>
  async (ctx: JobContext) => {
    const isProd = ctx.branch.name === "main";
    const VERCEL_ACCESS_TOKEN = process.env.VERCEL_ACCESS_TOKEN;
    const VERCEL_ORG_ID = "team_Zcr7s5jVtNqVKO8Q4w7Kcm9T";
    const VERCEL_SCOPE = "heyxyz";

    await run("rm -rf .pnpm-store");

    await run(
      `${vercel} pull --environment=production --yes --token $VERCEL_ACCESS_TOKEN`,
      {
        label: `Pulling ${PROJECT_NAME} Deployment`,
        env: { VERCEL_ORG_ID, VERCEL_PROJECT_ID }
      }
    );

    await run(`${vercel} build --prod --token $VERCEL_ACCESS_TOKEN`, {
      label: `Building ${PROJECT_NAME} Deployment`,
      env: { VERCEL_ORG_ID, VERCEL_PROJECT_ID }
    });

    const { stdout } = await run(
      `${vercel} deploy --prebuilt --scope ${VERCEL_SCOPE} ${isProd ? "" : "--no-wait"} --yes ${
        isProd ? "--prod" : ""
      } --no-color --token $VERCEL_ACCESS_TOKEN -e PIERRE_BRANCH_ID=${
        ctx.branch.id
      } -e PIERRE_ENVIRONMENT=${isProd ? "production" : "preview"}`,
      {
        label: `Creating ${PROJECT_NAME} Deployment`,
        env: { VERCEL_ORG_ID, VERCEL_PROJECT_ID }
      }
    );

    const previewURL = stdout
      .replace(/\r?\n|\r/g, " ")
      .match(/https:\/\/[\w\n-]+\.vercel\.app/g)?.[0];

    if (previewURL) {
      annotate({
        color: "fg",
        label: ` ${PROJECT_NAME} App Preview`,
        icon: Icons.Link,
        href: previewURL,
        description: previewURL
      });

      try {
        const previewUrlNoScheme = previewURL.replace(/^https?:\/\//, "");
        const response = await fetch(
          `https://api.vercel.com/v6/deployments?slug=${VERCEL_SCOPE}&app=${PROJECT_NAME.toLowerCase()}`,
          { headers: { Authorization: `Bearer ${VERCEL_ACCESS_TOKEN}` } }
        );

        const result: {
          deployments?: VercelDeployment[];
        } = await response.json();
        let activeDeploy: VercelDeployment | undefined;

        if (result?.deployments) {
          for (const deployment of result.deployments) {
            if (!activeDeploy && deployment.url === previewUrlNoScheme) {
              console.log("Deployment found: ", deployment.uid);
              activeDeploy = deployment;
            }
          }
        }

        if (activeDeploy?.inspectorUrl) {
          annotate({
            icon: Icons.BoxTape,
            color: "fg",
            label: ` ${PROJECT_NAME} Deployment Build Details`,
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

    const { exitCode } = await run(
      `${vercel} inspect ${previewURL} --scope ${VERCEL_SCOPE} --logs --wait --timeout=15m --no-color --token $VERCEL_ACCESS_TOKEN`,
      {
        label: ` ${PROJECT_NAME} Deployment Build`,
        env: { VERCEL_ORG_ID, VERCEL_PROJECT_ID }
      }
    );

    if (exitCode !== 0) {
      throw new Error(` ${PROJECT_NAME} build failed`);
    }
  };
