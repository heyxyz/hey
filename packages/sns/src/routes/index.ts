import type { FastifyPluginAsync } from 'fastify';

import firehose from '../controllers/firehose';

const routes: FastifyPluginAsync = async (server) => {
  server.get('/', async function () {
    return 'gm, to sns service 👋';
  });

  server.post('/firehose', async function (request) {
    return firehose(request);
  });
};

export default routes;
