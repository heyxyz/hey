import type { CodegenConfig } from "@graphql-codegen/cli";
import LensEndpoint from "@hey/data/lens-endpoints";

const config: CodegenConfig = {
  config: {
    inlineFragmentTypes: "combine",
    noGraphQLTag: true
  },
  documents: "./documents/**/*.graphql",
  generates: {
    "generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
        "fragment-matcher"
      ]
    }
  },
  hooks: {
    afterAllFileWrite: ["biome format --write ."]
  },
  overwrite: true,
  schema: LensEndpoint.Testnetv3
};

export default config;
