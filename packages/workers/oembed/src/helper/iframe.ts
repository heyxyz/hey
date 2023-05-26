const generateIframe = (url: string, site: string) => {
  switch (site) {
    case 'youtube.com':
    case 'youtu.be':
    case 'lenstube.xyz':
      return `<iframe src="${url}" width="560" height="315" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media" allowfullscreen></iframe>`;
    case 'open.spotify.com':
      const spotifyUrl = url.replace('/track', '/embed/track');
      return `<iframe src="${spotifyUrl}" width="560" height="155" frameborder="0" allow="autoplay; clipboard-write; encrypted-media"></iframe>`;
    default:
      return `<iframe src="${url}" frameborder="0" allowfullscreen></iframe>`;
  }
};

export default generateIframe;
