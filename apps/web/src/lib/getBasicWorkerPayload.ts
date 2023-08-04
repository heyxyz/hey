import { IS_MAINNET } from '@lenster/data/constants';
import { Cookie } from '@lenster/data/storage';
import Cookies from 'js-cookie';

const getBasicWorkerPayload = () => {
  const accessToken = Cookies.get(Cookie.AccessToken);

  return { accessToken, isMainnet: IS_MAINNET };
};

export default getBasicWorkerPayload;
