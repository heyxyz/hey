const generatePublicIP = (): string => {
  let firstSegment = Math.floor(Math.random() * 256);

  // Avoiding private IP ranges: 10.x.x.x, 172.16.x.x - 172.31.x.x, and 192.168.x.x
  while (firstSegment === 10 || firstSegment === 172 || firstSegment === 192) {
    firstSegment = Math.floor(Math.random() * 256);
  }

  let secondSegment =
    firstSegment === 172
      ? Math.floor(Math.random() * 16)
      : Math.floor(Math.random() * 256);

  const thirdSegment = Math.floor(Math.random() * 256);
  const fourthSegment = Math.floor(Math.random() * 256);

  return `${firstSegment}.${secondSegment}.${thirdSegment}.${fourthSegment}`;
};

export default generatePublicIP;
