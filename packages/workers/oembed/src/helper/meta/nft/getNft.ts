import getZoraNFT from './getZoraNft';

const knownSites = ['zora.co'];

const getNft = async (url: string) => {
  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname.replace('www.', '');

  if (!knownSites.includes(hostname)) {
    return null;
  }

  switch (hostname) {
    case 'zora.co':
      return await getZoraNFT(url);
    default:
      return null;
  }
};

export default getNft;
