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
  notify: (name: string) => {
    browserPushWorker.postMessage({
      name
    });

    browserPushWorker.onmessage = function (event: MessageEvent) {
      const response = event.data;
      console.log(response);
      // new push notification
      new Notification('Hey', {
        body: response.id,
        icon: ''
      });
    };
  }
};
