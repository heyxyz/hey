import { APP_VERSION } from "@hey/data/constants";
import type { FC } from "react";
import { useEffect } from "react";

const ServiceWorkerProvider: FC = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }

        navigator.serviceWorker
          .register(`/sw.js?v=${APP_VERSION}`, { scope: "/" })
          .then(() => {
            console.log("Service Worker registered successfully.");
          })
          .catch(console.error);
      });
    }
  }, []);

  return null;
};

export default ServiceWorkerProvider;
