const onMessage = (event: MessageEvent) => {
  const { data } = event;
  postMessage(data);
};

addEventListener('message', onMessage);
