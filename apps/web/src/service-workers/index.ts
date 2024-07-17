declare let self: ServiceWorkerGlobalScope;

const IMPRESSIONS_ENDPOINT = 'https://api.hey.xyz/leafwatch/impressions';
const PUBLICATIONS_VISIBILITY_INTERVAL = 5000;
const visiblePublications = new Set<string>();

const sendVisiblePublicationsToServer = async () => {
  if (visiblePublications.size === 0) {
    return;
  }

  const publicationsToSend = Array.from(visiblePublications);
  visiblePublications.clear();

  try {
    await fetch(IMPRESSIONS_ENDPOINT, {
      body: JSON.stringify({ ids: publicationsToSend }),
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      method: 'POST'
    });
  } catch (error) {
    console.error('Failed to send visible publications to Leafwatch', error);
  }
};

setInterval(sendVisiblePublicationsToServer, PUBLICATIONS_VISIBILITY_INTERVAL);

const handleActivate = async (): Promise<void> => {
  await self.clients.claim();
};

self.addEventListener('message', (event) => {
  if (event.data?.type === 'PUBLICATION_VISIBLE') {
    visiblePublications.add(event.data.id);
  }
});

self.addEventListener('activate', (event) => event.waitUntil(handleActivate()));

export {};
