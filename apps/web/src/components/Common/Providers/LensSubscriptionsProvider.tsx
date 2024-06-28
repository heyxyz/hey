import type { FC } from 'react';

import getCurrentSession from '@helpers/getCurrentSession';
import { useUserSigNoncesSubscriptionSubscription } from '@hey/lens';
import { useEffect } from 'react';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import { useAccount } from 'wagmi';

const LensSubscriptionsProvider: FC = () => {
  const { setLensHubOnchainSigNonce } = useNonceStore();
  const { address } = useAccount();
  const { id: sessionProfileId } = getCurrentSession();
  const canUseSubscriptions = Boolean(sessionProfileId) && Boolean(address);

  // User Sig Nonces Subscription
  const { data: userSigNoncesData } = useUserSigNoncesSubscriptionSubscription({
    skip: !canUseSubscriptions,
    variables: { address }
  });

  useEffect(() => {
    if (userSigNoncesData?.userSigNonces) {
      setLensHubOnchainSigNonce(
        userSigNoncesData.userSigNonces.lensHubOnchainSigNonce
      );
    }
  }, [userSigNoncesData, setLensHubOnchainSigNonce]);

  return null;
};

export default LensSubscriptionsProvider;
