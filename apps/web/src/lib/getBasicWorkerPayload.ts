import { IS_MAINNET } from '@lenster/data/constants';
import { Localstorage } from '@lenster/data/storage';

const getBasicWorkerPayload = () => {
  const accessToken = localStorage.getItem(Localstorage.AccessToken);

  return { accessToken, isMainnet: IS_MAINNET };
};

export default getBasicWorkerPayload;
