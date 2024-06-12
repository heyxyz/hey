declare let self: ServiceWorkerGlobalScope;

const eventsEndpoint = 'https://api.hey.xyz/leafwatch/events';
const impressionsEndpoint = 'https://api.hey.xyz/leafwatch/impressions';

const eventsIngestionInterval = 1000;
const publicationsVisibilityInterval = 5000;

let viewerId: null | string = null;
const visiblePublicationsSet = new Set();
const eventsQueue: any[] = [];

const sendVisiblePublicationsToServer = () => {
  const publicationsToSend = Array.from(visiblePublicationsSet);

  if (publicationsToSend.length > 0 && viewerId) {
    visiblePublicationsSet.clear();
    fetch(impressionsEndpoint, {
      body: JSON.stringify({ ids: publicationsToSend, viewer_id: viewerId }),
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      method: 'POST'
    })
      .then(() => {})
      .catch(() => {});
  }
};

const sendEventsToServer = () => {
  if (eventsQueue.length > 0) {
    const eventsToSend = eventsQueue.splice(0, eventsQueue.length);
    fetch(eventsEndpoint, {
      body: JSON.stringify(eventsToSend),
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      method: 'POST'
    })
      .then(() => {})
      .catch(() => {});
  }
};

setInterval(sendVisiblePublicationsToServer, publicationsVisibilityInterval);
setInterval(sendEventsToServer, eventsIngestionInterval);

const handleActivate = async (): Promise<void> => {
  await self.clients.claim();
};

self.addEventListener('message', (event) => {
  // Impression tracking
  if (event.data && event.data.type === 'PUBLICATION_VISIBLE') {
    visiblePublicationsSet.add(event.data.id);
    viewerId = event.data.viewerId;
  }

  // Event tracking
  if (event.data && event.data.type === 'EVENT') {
    eventsQueue.push(event.data);
  }
});

self.addEventListener('activate', (event) => event.waitUntil(handleActivate()));

export {};
