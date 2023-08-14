import type { FastifyRequest } from 'fastify';

const firehose = async (request: FastifyRequest) => {
  console.log(request.body);
  return 'gm, to firehose service 👋';
};

export default firehose;
