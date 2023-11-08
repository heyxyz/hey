const impressionsEndpoint = 'https://impressions.hey.xyz/ingest';
const publicationsVisibilityInterval = 5000;
let visiblePublicationsSet = new Set();

function sendVisiblePublicationsToServer() {
  const publicationsToSend = Array.from(visiblePublicationsSet);

  if (publicationsToSend.length > 0) {
    visiblePublicationsSet.clear();
    fetch(impressionsEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        viewer_id: '550e8400-e29b-41d4-a716-446655440000',
        ids: publicationsToSend
      }),
      keepalive: true
    })
      .then(() => {})
      .catch(() => {});
  }
}

setInterval(sendVisiblePublicationsToServer, publicationsVisibilityInterval);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PUBLICATION_VISIBLE') {
    visiblePublicationsSet.add(event.data.id);
  }
});
