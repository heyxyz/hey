const knownSites = [
  'youtube.com',
  'youtu.be',
  'lenstube.xyz',
  'open.spotify.com',
  'soundcloud.com',
  'oohlala.xyz'
];

const pickUrlSites = ['open.spotify.com'];

const spotifyUrlRegex =
  /^ht{2}ps?:\/{2}open\.spotify\.com\/track\/[\dA-Za-z]+(\?si=[\dA-Za-z]+)?$/;
const oohlalaUrlRegex =
  /^ht{2}ps?:\/{2}oohlala\.xyz\/playlist\/[\dA-Fa-f-]+(\?si=[\dA-Za-z]+)?$/;
const soundCloudRegex =
  /^ht{2}ps?:\/{2}soundcloud\.com(?:\/[\dA-Za-z-]+){2}(\?si=[\dA-Za-z]+)?$/;
const youtubeRegex =
  /^https?:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w-]+)(?:\?.*)?$/;
const lenstubeRegex =
  /^https?:\/\/lenstube\.xyz\/watch\/[\dA-Za-z-]+(\?si=[\dA-Za-z]+)?$/;

const generateIframe = (
  embedUrl: string | null,
  url: string
): string | null => {
  const universalSize = `width="560" height="315"`;
  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname.replace('www.', '');
  const pickedUrl = pickUrlSites.includes(hostname) ? url : embedUrl;

  if (!knownSites.includes(hostname) || !pickedUrl) {
    return null;
  }

  switch (hostname) {
    case 'youtube.com':
    case 'youtu.be':
      if (youtubeRegex.test(url)) {
        return `<iframe src="${pickedUrl}" ${universalSize} allow="accelerometer; encrypted-media" allowfullscreen></iframe>`;
      }

      return null;
    case 'lenstube.xyz':
      if (lenstubeRegex.test(url)) {
        return `<iframe src="${pickedUrl}" ${universalSize} allow="accelerometer; encrypted-media" allowfullscreen></iframe>`;
      }

      return null;
    case 'open.spotify.com':
      if (spotifyUrlRegex.test(url)) {
        const spotifyUrl = pickedUrl.replace('/track', '/embed/track');
        return `<iframe src="${spotifyUrl}" width="560" height="155" allow="encrypted-media"></iframe>`;
      }

      return null;
    case 'soundcloud.com':
      if (soundCloudRegex.test(url)) {
        return `<iframe src="${pickedUrl}" ${universalSize}></iframe>`;
      }

      return null;
    case 'oohlala.xyz':
      if (oohlalaUrlRegex.test(url)) {
        return `<iframe src="${pickedUrl}" ${universalSize}></iframe>`;
      }

      return null;
    default:
      return `<iframe src="${pickedUrl}" width="560"></iframe>`;
  }
};

export default generateIframe;
