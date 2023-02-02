import { createData, signers } from 'arbundles';

type EnvType = {
  BUNDLR_PRIVATE_KEY: string;
};

export default {
  async fetch(request: Request, env: EnvType) {
    return await handleRequest(request, env);
  }
};

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json'
};

async function handleRequest(request: Request, env: EnvType) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, message: 'Only POST requests are supported' }), {
      headers
    });
  }

  const payload = await request.json();

  if (!payload) {
    return new Response(JSON.stringify({ success: false, message: 'No body provided' }), { headers });
  }

  try {
    const { EthereumSigner } = signers;
    const signer = new EthereumSigner(env.BUNDLR_PRIVATE_KEY);
    const tx = await createData(JSON.stringify(payload), signer);
    tx.sign(signer).catch((error) => console.log(error));

    return new Response(JSON.stringify({ success: tx.getRaw() }), { headers });
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Something went wrong!' }), { headers });
  }
}
