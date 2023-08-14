import { Type } from '@sinclair/typebox';
import type { FastifyPluginAsync } from 'fastify';

const routes: FastifyPluginAsync = async (server) => {
  server.get(
    '/',
    {
      schema: {
        response: {
          200: Type.Object({
            hello: Type.String()
          })
        }
      }
    },
    async function () {
      return { hello: 'world' };
    }
  );
};

export default routes;
