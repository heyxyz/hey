import IFramely from '@components/Shared/IFramely';
import Markup from '@components/Shared/Markup';
import PublicationContentShimmer from '@components/Shared/Shimmer/PublicationContentShimmer';
import { Card } from '@components/UI/Card';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import type { LensterPublication } from '@generated/types';
import {
  CollectionIcon,
  DatabaseIcon,
  EyeIcon,
  FingerPrintIcon,
  PhotographIcon,
  UserAddIcon
} from '@heroicons/react/outline';
import { LockClosedIcon } from '@heroicons/react/solid';
import { LensGatedSDK } from '@lens-protocol/sdk-gated';
import formatHandle from '@lib/formatHandle';
import getIPFSLink from '@lib/getIPFSLink';
import getURLs from '@lib/getURLs';
import axios from 'axios';
import clsx from 'clsx';
import { LIT_PROTOCOL_ENVIRONMENT } from 'data/constants';
import type { PublicationMetadataV2Input } from 'lens';
import { DecryptFailReason } from 'lens';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useProvider, useSigner } from 'wagmi';

interface DecryptMessageProps {
  icon: ReactNode;
  children: ReactNode;
}

const DecryptMessage: FC<DecryptMessageProps> = ({ icon, children }) => (
  <div className="flex items-center space-x-2">
    {icon}
    <span>{children}</span>
  </div>
);

interface Props {
  encryptedPublication: LensterPublication;
}

const DecryptedPublicationBody: FC<Props> = ({ encryptedPublication }) => {
  const { pathname } = useRouter();
  const [decryptedData, setDecryptedData] = useState<any>(null);
  const [decryptError, setDecryptError] = useState<any>(null);
  const provider = useProvider();
  const { data: signer } = useSigner();

  const canDecrypt = encryptedPublication?.canDecrypt?.result;
  const { reasons } = encryptedPublication.canDecrypt;
  const showMore = encryptedPublication?.metadata?.content?.length > 450 && pathname !== '/posts/[id]';

  // Status
  // Collect checks - https://docs.lens.xyz/docs/gated#collected-publication
  const hasNotCollectedPublication = reasons?.includes(DecryptFailReason.HasNotCollectedPublication);
  const collectNotFinalisedOnChain =
    !hasNotCollectedPublication && reasons?.includes(DecryptFailReason.CollectNotFinalisedOnChain);
  // Follow checks - https://docs.lens.xyz/docs/gated#profile-follow
  const doesNotFollowProfile = reasons?.includes(DecryptFailReason.DoesNotFollowProfile);
  const followNotFinalisedOnChain =
    !doesNotFollowProfile && reasons?.includes(DecryptFailReason.FollowNotFinalisedOnChain);
  // Profile check - https://docs.lens.xyz/docs/gated#profile-ownership
  const doesNotOwnProfile = reasons?.includes(DecryptFailReason.DoesNotOwnProfile);
  // Token check - https://docs.lens.xyz/docs/gated#erc20-token-ownership
  const unauthorizedBalance = reasons?.includes(DecryptFailReason.UnauthorizedBalance);
  // NFT check - https://docs.lens.xyz/docs/gated#erc20-token-ownership
  const doesNotOwnNft = reasons?.includes(DecryptFailReason.DoesNotOwnNft);

  // Style
  const cardClasses =
    'text-sm rounded-xl w-fit p-9 shadow-sm bg-gradient-to-tr from-brand-400 to-brand-600 cursor-text';

  const getDecryptedData = async () => {
    if (!signer) {
      return;
    }

    const contentUri = getIPFSLink(encryptedPublication?.onChainContentURI);
    const { data } = await axios.get(contentUri);
    const sdk = await LensGatedSDK.create({ provider, signer, env: LIT_PROTOCOL_ENVIRONMENT as any });
    const { decrypted, error } = await sdk.gated.decryptMetadata(data);
    setDecryptedData(decrypted);
    setDecryptError(error);
  };

  useEffect(() => {
    if (canDecrypt) {
      getDecryptedData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canDecrypt]);

  if (!canDecrypt) {
    return (
      <Card className={cardClasses} onClick={(event) => event.stopPropagation()}>
        <div className="font-bold flex items-center space-x-2">
          <LockClosedIcon className="h-5 w-5 text-green-300" />
          <span className="text-white font-black text-base">Unlock this by...</span>
        </div>
        <div className="pt-3.5 space-y-2 text-white">
          {/* Collect checks */}
          {hasNotCollectedPublication && (
            <DecryptMessage icon={<CollectionIcon className="h-4 w-4" />}>
              Collect this <b className="lowercase">{encryptedPublication?.__typename}</b>
            </DecryptMessage>
          )}
          {collectNotFinalisedOnChain && (
            <DecryptMessage icon={<CollectionIcon className="animate-pulse h-4 w-4" />}>
              Collect finalizing on chain...
            </DecryptMessage>
          )}

          {/* Follow checks */}
          {doesNotFollowProfile && (
            <DecryptMessage icon={<UserAddIcon className="h-4 w-4" />}>
              Follow{' '}
              <Link href={`/u/${formatHandle(encryptedPublication?.profile?.handle)}`} className="font-bold">
                @{formatHandle(encryptedPublication?.profile?.handle)}
              </Link>
            </DecryptMessage>
          )}
          {followNotFinalisedOnChain && (
            <DecryptMessage icon={<UserAddIcon className="animate-pulse h-4 w-4" />}>
              Follow finalizing on chain...
            </DecryptMessage>
          )}

          {/* Profile check */}
          {doesNotOwnProfile && (
            <DecryptMessage icon={<FingerPrintIcon className="h-4 w-4" />}>
              You don't own the profile
            </DecryptMessage>
          )}

          {/* Token check */}
          {unauthorizedBalance && (
            <DecryptMessage icon={<DatabaseIcon className="h-4 w-4" />}>
              You don't have enough tokens
            </DecryptMessage>
          )}

          {/* NFT check */}
          {doesNotOwnNft && (
            <DecryptMessage icon={<PhotographIcon className="h-4 w-4" />}>
              You don't have the NFT
            </DecryptMessage>
          )}
        </div>
      </Card>
    );
  }

  if (decryptError) {
    return <ErrorMessage title="Error while decrypting!" error={decryptError} />;
  }

  if (!decryptedData) {
    return <PublicationContentShimmer />;
  }

  const publication: PublicationMetadataV2Input = decryptedData;

  return (
    <div className="break-words">
      <Markup
        className={clsx(
          { 'line-clamp-5': showMore },
          'whitespace-pre-wrap break-words leading-md linkify text-md'
        )}
      >
        {publication?.content}
      </Markup>
      {showMore && (
        <div className="mt-4 text-sm text-gray-500 font-bold flex items-center space-x-1">
          <EyeIcon className="h-4 w-4" />
          <Link href={`/posts/${encryptedPublication?.id}`}>Show more</Link>
        </div>
      )}
      {publication?.content
        ? getURLs(publication?.content)?.length > 0 && <IFramely url={getURLs(publication?.content)[0]} />
        : null}
    </div>
  );
};

export default DecryptedPublicationBody;
