const onBrowserPushWorkerMessage = (event: MessageEvent) => {
  const { data } = event;
  postMessage(data);
};

addEventListener('message', onBrowserPushWorkerMessage);
