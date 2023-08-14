import 'dotenv/config';

import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

export enum NodeEnv {
  development = 'development',
  test = 'test',
  production = 'production'
}

const ConfigSchema = Type.Strict(
  Type.Object({
    NODE_ENV: Type.Enum(NodeEnv),
    LOG_LEVEL: Type.String(),
    API_HOST: Type.String(),
    API_PORT: Type.String(),
    CLICKHOUSE_USERNAME: Type.String(),
    CLICKHOUSE_PASSWORD: Type.String()
  })
);

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
  allowUnionTypes: true
});

export type Config = Static<typeof ConfigSchema>;

const configPlugin: FastifyPluginAsync = async (server) => {
  const validate = ajv.compile(ConfigSchema);
  const valid = validate(process.env);
  if (!valid) {
    throw new Error(
      '.env file validation failed - ' +
        JSON.stringify(validate.errors, null, 2)
    );
  }
  server.decorate('config', process.env as any);
};

declare module 'fastify' {
  interface FastifyInstance {
    config: Config;
  }
}

export default fp(configPlugin);
