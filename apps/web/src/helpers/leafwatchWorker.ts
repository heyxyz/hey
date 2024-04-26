const onLeafwatchworkerMessage = (event: MessageEvent) => {
  const { data } = event;
  postMessage(data);
};

addEventListener('message', onLeafwatchworkerMessage);
