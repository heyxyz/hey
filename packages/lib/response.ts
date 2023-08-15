/**
 * Cloudflare Worker Response
 * @param data object
 * @returns {Response}
 */
const response = (data: object): Response => {
  return new Response(JSON.stringify(data));
};

export default response;
