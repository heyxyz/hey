export default async (url: string) => {
  try {
    const response = new Response(
      JSON.stringify({ success: true, poll: 'gm' })
    );

    // Disable caching because the poll data is dynamic and changes frequently because of live polling.
    response.headers.set('Cache-Control', 'no-store');

    return response;
  } catch (error) {
    console.error('Failed to get proposal', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
