const generateIframe = (url: string, site: string) => {
  switch (site) {
    case 'youtube.com':
    case 'youtu.be':
    case 'lenstube.xyz':
      return `<iframe src="${url}" width="560" height="315" allow="accelerometer; encrypted-media" allowfullscreen></iframe>`;
    case 'open.spotify.com':
      const spotifyUrl = url.replace('/track', '/embed/track');
      return `<iframe src="${spotifyUrl}" width="560" height="155" allow="encrypted-media"></iframe>`;
    case 'soundcloud.com':
      return `<iframe src="${url}" width="560" height="315"></iframe>`;
    default:
      return `<iframe src="${url}" width="560"></iframe>`;
  }
};

export default generateIframe;
