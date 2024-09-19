declare let self: ServiceWorkerGlobalScope;

const IMPRESSIONS_ENDPOINT = "https://api.hey.xyz/leafwatch/impressions";
const EVENTS_ENDPOINT = "https://api.hey.xyz/leafwatch/events";
const SYNC_INTERVAL = 5000;

// Track visible publications and events
const visiblePublications = new Set<string>();
let identityToken: string | undefined;
let recordedEvents: Record<string, unknown>[] = [];

// Send visible publications to the server
const sendVisiblePublicationsToServer = async () => {
  if (visiblePublications.size === 0) {
    return;
  }

  const publicationsToSend = Array.from(visiblePublications);
  visiblePublications.clear();

  try {
    await fetch(IMPRESSIONS_ENDPOINT, {
      body: JSON.stringify({ ids: publicationsToSend }),
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      method: "POST"
    });
  } catch (error) {
    console.error("Failed to send visible publications to Leafwatch", error);
  }
};

// Send recorded events to the server
const sendEventsToServer = async () => {
  if (recordedEvents.length === 0) {
    return;
  }

  const eventsToSend = [...recordedEvents];
  recordedEvents = [];

  try {
    await fetch(EVENTS_ENDPOINT, {
      body: JSON.stringify({ events: eventsToSend }),
      headers: {
        "Content-Type": "application/json",
        "X-Identity-Token": identityToken as string
      },
      keepalive: true,
      method: "POST"
    });
  } catch (error) {
    console.error("Failed to send recorded events to Leafwatch", error);
  }
};

// Set up intervals for syncing data
setInterval(sendVisiblePublicationsToServer, SYNC_INTERVAL);
setInterval(sendEventsToServer, SYNC_INTERVAL);

// Activate and claim control over clients immediately
const handleActivate = async (): Promise<void> => {
  await self.clients.claim();
};

self.addEventListener("message", (event) => {
  if (event.data?.type === "PUBLICATION_IMPRESSION") {
    visiblePublications.add(event.data.id);
  }
  if (event.data?.type === "EVENT") {
    identityToken = event.data.identityToken;
    recordedEvents.push(event.data.event);
  }
});

// Install event to update immediately
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(handleActivate());
});

export {};
