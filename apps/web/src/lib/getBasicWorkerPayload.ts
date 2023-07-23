import { IS_MAINNET } from '@lenster/data/constants';
import { Localstorage } from '@lenster/data/storage';

const getBasicWorkerPayload = () => {
  return {
    accessToken: localStorage.getItem(Localstorage.AccessToken),
    isMainnet: IS_MAINNET
  };
};

export default getBasicWorkerPayload;
