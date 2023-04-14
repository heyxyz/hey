interface EnvType {
  POSTMARK_TOKEN: string;
}

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

  const payload: any = await request.json();
  const { email, subject, body } = payload;

  if (!email || !subject || !body) {
    return new Response(JSON.stringify({ success: false, message: 'Please fill all the fields' }), {
      headers
    });
  }

  try {
    await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-Postmark-Server-Token': env.POSTMARK_TOKEN
      },
      body: JSON.stringify({
        From: 'contact@lenster.xyz',
        ReplyTo: email,
        To: 'support@lenster.freshdesk.com',
        Subject: subject,
        TextBody: body,
        MessageStream: 'outbound'
      })
    });

    return new Response(JSON.stringify({ success: true }), {
      headers
    });
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Something went wrong!' }), { headers });
  }
};

export default {
  async fetch(request: Request, env: EnvType) {
    return await handleRequest(request, env);
  }
};
