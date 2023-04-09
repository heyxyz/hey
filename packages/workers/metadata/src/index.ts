import { createData, EthereumSigner } from 'bundlr';

interface EnvType {
  BUNDLR_PRIVATE_KEY: string;
}

export default {
  async fetch(request: Request, env: EnvType) {
    return await handleRequest(request, env);
  }
};

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

const handleRequest = async (request: Request, env: EnvType) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, message: 'Only POST requests are supported' }), {
      headers
    });
  }

  try {
    const payload = await request.json();
    const signer = new EthereumSigner(env.BUNDLR_PRIVATE_KEY);
    const tx = createData(JSON.stringify(payload), signer, {
      tags: [
        { name: 'content-type', value: 'application/json' },
        { name: 'App-Name', value: 'Lenster' }
      ]
    });
    await tx.sign(signer);
    const bundlrRes = await fetch('http://node2.bundlr.network/tx/matic', {
      method: 'POST',
      headers: { 'content-type': 'application/octet-stream' },
      body: tx.getRaw()
    });

    if (bundlrRes.statusText === 'Created' || bundlrRes.statusText === 'OK') {
      return new Response(JSON.stringify({ success: true, id: tx.id }), { headers });
    } else {
      return new Response(JSON.stringify({ success: false, message: 'Bundlr error!', bundlrRes }), {
        headers
      });
    }
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Something went wrong!' }), { headers });
  }
};
