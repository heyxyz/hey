const impressionsEndpoint = 'https://impressions.hey.xyz/ingest';
const publicationsVisibilityInterval = 5000;
let viewerId = null;
let visiblePublicationsSet = new Set();

function sendVisiblePublicationsToServer() {
  const publicationsToSend = Array.from(visiblePublicationsSet);

  if (publicationsToSend.length > 0) {
    visiblePublicationsSet.clear();
    fetch(impressionsEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        viewer_id: viewerId,
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
    viewerId = event.data.viewerId;
  }
});
