const generateIframe = (url: string, site: string) => {
  switch (site) {
    case 'youtube.com':
    case 'youtu.be':
    case 'lenstube.xyz':
      return `<iframe width="560" height="315" src="${url}" frameborder="0" allow="accelerometer; autoplay; clipboard-write;" allowfullscreen></iframe>`;
    case 'oohlala.xyz':
      return `<iframe src="${url}" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no"></iframe>`;
    case 'open.spotify.com':
      const spotifyUrl = url.replace('/track', '/embed/track');
      return `<iframe src="${spotifyUrl}" style="border-radius: 12px" width="100%" height="152" frameborder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    default:
      return `<iframe src="${url}" frameborder="0" allowfullscreen></iframe>`;
  }
};

export default generateIframe;
