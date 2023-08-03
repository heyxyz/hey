import { IS_MAINNET } from '@lenster/data/constants';
import { hydrateAuthTokens } from 'src/store/auth';

const getBasicWorkerPayload = () => {
  const { accessToken } = hydrateAuthTokens();

  return { accessToken, isMainnet: IS_MAINNET };
};

export default getBasicWorkerPayload;
