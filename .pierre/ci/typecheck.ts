import { Icons, annotate, run } from "pierre";

// biome-ignore lint/suspicious/noControlCharactersInRegex: <explanation>
const ANSI_COLOR_REGEX = /\x1b\[[0-9;]*m/g;
const ERROR_REGEX = /^(.*?): (.*?):([0-9]+):[0-9]+ - (.*?): (.*)$/;

export const label = "Typecheck";

export const options = {
  failOnAnnotations: true
};

export default async () => {
  const { stdmerged, exitCode } = await run("pnpm typecheck", {
    label: "Running Typechecks",
    allowAnyCode: true
  });

  const lines = stdmerged.split("\n");

  for (const line of lines) {
    const cleanedLine = line.replace(ANSI_COLOR_REGEX, "");
    const match = cleanedLine.match(ERROR_REGEX);

    if (match == null) {
      continue;
    }

    const [, packageName, filepath, lineNo, errorCode, errorMessage] = match;
    const packagePath = packageName.replace(" typecheck", "");

    annotate({
      icon: Icons.CiFailed,
      color: "red",
      filename: `${packagePath}/${filepath}`,
      line: Number.parseInt(lineNo),
      label: "Typescript failure",
      description: `${errorMessage} (${errorCode})`
    });
  }

  return exitCode;
};
