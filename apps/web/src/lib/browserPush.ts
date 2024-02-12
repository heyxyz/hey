let browserPushWorker: Worker;

if (typeof Worker !== 'undefined') {
  browserPushWorker = new Worker(
    new URL('./browserPushWorker', import.meta.url)
  );
}

/**
 * Browser push notification
 */
export const BrowserPush = {
  notify: ({ title }: { title: string }) => {
    browserPushWorker.postMessage({ title });

    browserPushWorker.onmessage = (event: MessageEvent) => {
      if (!('Notification' in window)) {
        return;
      }

      const response = event.data;
      new Notification('Hey', {
        body: response.title,
        icon: '/logo.png'
      });
    };
  }
};
