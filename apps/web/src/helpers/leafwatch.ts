import { IS_MAINNET } from "@hey/data/constants";
import { Localstorage } from "@hey/data/storage";
import { getAuthApiHeadersWithAccessToken } from "./getAuthApiHeaders";

/**
 * Leafwatch analytics
 */
export const Leafwatch = {
  track: (name: string, properties?: Record<string, unknown>) => {
    const { referrer } = document;
    const referrerDomain = referrer ? new URL(referrer).hostname : null;
    const fingerprint = localStorage.getItem(Localstorage.FingerprintStore);

    if (IS_MAINNET && navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({
        event: {
          fingerprint: fingerprint || undefined,
          name,
          properties,
          referrer: referrerDomain,
          url: window.location.href
        },
        identityToken:
          getAuthApiHeadersWithAccessToken()["X-Identity-Token"] || undefined,
        type: "EVENT"
      });
    }
  }
};
