import type { FC } from "react";
import { useEffect } from "react";

const ServiceWorkerProvider: FC = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Unregister existing service workers
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());

        // Register new service worker after all previous ones are unregistered
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then(() => {
            console.log("New Service Worker registered successfully.");
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      });
    }
  }, []);

  return null;
};

export default ServiceWorkerProvider;
