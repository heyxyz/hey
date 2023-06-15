import type { Env } from '../types';

type IsLiveResponse = {
  roomId: string;
};

export default async (spaceId: string, env: Env) => {
  try {
    const huddleResponse = await fetch(
      `http://api.huddle01.com/api/v1/live-meeting?roomId=${spaceId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.HUDDLE_API_KEY
        }
      }
    );

    const isLiveResponse: IsLiveResponse = await huddleResponse.json();
    console.log('huddleResponse', isLiveResponse);

    return new Response(
      JSON.stringify({
        success: false,
        isLive: isLiveResponse.roomId === spaceId
      })
    );
  } catch (error) {
    console.error('Failed to get room isLive', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
