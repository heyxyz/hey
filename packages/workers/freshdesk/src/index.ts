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
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Only POST requests are supported'
      }),
      { headers }
    );
  }

  const payload: any = await request.json();
  const { email, profile, category, subject, body } = payload;

  if (!email || !category || !subject || !body) {
    return new Response(
      JSON.stringify({ success: false, message: 'Please fill all the fields' }),
      {
        headers
      }
    );
  }

  const profileInfo = profile
    ? `User ID: ${profile.id}\nHandle: ${profile.handle}`
    : 'Not signed in';
  const textBody = `${profileInfo}\n\nMessage:\n${body}`;
  try {
    await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-Postmark-Server-Token': env.POSTMARK_TOKEN
      },
      body: JSON.stringify({
        From: 'contact@hey.xyz',
        ReplyTo: email,
        To: 'support@lenster.freshdesk.com',
        Subject: category + ': ' + subject,
        TextBody: textBody,
        MessageStream: 'outbound'
      })
    }).then((response) => {
      if (response.status >= 400 && response.status < 600) {
        throw new Error(`Bad response: ${response.status}`);
      }

      return response;
    });
    return new Response(JSON.stringify({ success: true }), {
      headers
    });
  } catch {
    return new Response(
      JSON.stringify({ success: false, message: 'Something went wrong!' }),
      { headers }
    );
  }
};

export default {
  async fetch(request: Request, env: EnvType) {
    return await handleRequest(request, env);
  }
};
