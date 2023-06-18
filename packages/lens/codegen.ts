import type { CodegenConfig } from '@graphql-codegen/cli';
import { SUPERFLUID_SUBGRAPH } from '@lenster/data';

const config: CodegenConfig = {
  overwrite: true,
  schema: ['https://api-mumbai.lens.dev', SUPERFLUID_SUBGRAPH],
  documents: './documents/**/*.graphql',
  generates: {
    'generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
        'fragment-matcher'
      ]
    }
  },
  hooks: {
    afterAllFileWrite: ['eslint --fix', 'prettier --write']
  }
};

export default config;
