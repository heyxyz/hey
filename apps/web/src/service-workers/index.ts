declare let self: ServiceWorkerGlobalScope;

const impressionsEndpoint = 'https://api.hey.xyz/leafwatch/impressions';
const publicationsVisibilityInterval = 5000;
let viewerId: null | string = null;
const visiblePublicationsSet = new Set();

const sendVisiblePublicationsToServer = () => {
  const publicationsToSend = Array.from(visiblePublicationsSet);

  if (publicationsToSend.length > 0 && viewerId) {
    visiblePublicationsSet.clear();
    fetch(impressionsEndpoint, {
      body: JSON.stringify({
        ids: publicationsToSend,
        viewer_id: viewerId
      }),
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      method: 'POST'
    })
      .then(() => {})
      .catch(() => {});
  }
};

setInterval(sendVisiblePublicationsToServer, publicationsVisibilityInterval);

const handleActivate = async (): Promise<void> => {
  await self.clients.claim();
};

self.addEventListener('message', (event) => {
  // Impression tracking
  if (event.data && event.data.type === 'PUBLICATION_VISIBLE') {
    visiblePublicationsSet.add(event.data.id);
    viewerId = event.data.viewerId;
  }
});

self.addEventListener('activate', (event) => event.waitUntil(handleActivate()));

export {};
