import Attachments from '@components/Shared/Attachments';
import IFramely from '@components/Shared/IFramely';
import Markup from '@components/Shared/Markup';
import { Card } from '@components/UI/Card';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Tooltip } from '@components/UI/Tooltip';
import useNFT from '@components/utils/hooks/useNFT';
import {
  CollectionIcon,
  DatabaseIcon,
  EyeIcon,
  FingerPrintIcon,
  LogoutIcon,
  PhotographIcon,
  UserAddIcon
} from '@heroicons/react/outline';
import { LockClosedIcon } from '@heroicons/react/solid';
import { LensGatedSDK } from '@lens-protocol/sdk-gated';
import type {
  CollectConditionOutput,
  Erc20OwnershipOutput,
  NftOwnershipOutput
} from '@lens-protocol/sdk-gated/dist/graphql/types';
import { Analytics } from '@lib/analytics';
import formatHandle from '@lib/formatHandle';
import getIPFSLink from '@lib/getIPFSLink';
import getURLs from '@lib/getURLs';
import { t, Trans } from '@lingui/macro';
import axios from 'axios';
import clsx from 'clsx';
import { LIT_PROTOCOL_ENVIRONMENT, POLYGONSCAN_URL, RARIBLE_URL } from 'data/constants';
import type { Publication, PublicationMetadataV2Input } from 'lens';
import { DecryptFailReason, useCanDecryptStatusQuery } from 'lens';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useAuthStore } from 'src/store/auth';
import { PUBLICATION } from 'src/tracking';
import { useProvider, useSigner, useToken } from 'wagmi';

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
  encryptedPublication: Publication;
}

const DecryptedPublicationBody: FC<Props> = ({ encryptedPublication }) => {
  const { pathname } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowAuthModal = useAuthStore((state) => state.setShowAuthModal);
  const [decryptedData, setDecryptedData] = useState<any>(null);
  const [decryptError, setDecryptError] = useState<any>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [canDecrypt, setCanDecrypt] = useState<boolean>(encryptedPublication?.canDecrypt?.result);
  const [reasons, setReasons] = useState<any>(encryptedPublication?.canDecrypt.reasons);
  const provider = useProvider();
  const { data: signer } = useSigner();

  const showMore = encryptedPublication?.metadata?.content?.length > 450 && pathname !== '/posts/[id]';

  useCanDecryptStatusQuery({
    variables: {
      request: { publicationId: encryptedPublication.id },
      profileId: currentProfile?.id ?? null
    },
    pollInterval: 5000,
    skip: canDecrypt || !currentProfile,
    onCompleted: (data) => {
      setCanDecrypt(data.publication?.canDecrypt.result || false);
      setReasons(data.publication?.canDecrypt.reasons || []);
    }
  });

  const getCondition = (key: string) => {
    const criteria: any = encryptedPublication.metadata.encryptionParams?.accessCondition.or?.criteria;

    const getCriteria = (key: string) => {
      return criteria.map((item: any) => item[key]).find((item: any) => item);
    };

    if (getCriteria('and')?.criteria) {
      return getCriteria('and')
        .criteria.map((item: any) => item[key])
        .find((item: any) => item);
    }

    if (getCriteria('or')?.criteria) {
      return getCriteria('or')
        .criteria.map((item: any) => item[key])
        .find((item: any) => item);
    }

    return criteria.map((item: any) => item[key]).find((item: any) => item);
  };

  // Conditions
  const tokenCondition: Erc20OwnershipOutput = getCondition('token');
  const nftCondition: NftOwnershipOutput = getCondition('nft');
  const collectCondition: CollectConditionOutput = getCondition('collect');

  const { data: tokenData } = useToken({
    address: tokenCondition?.contractAddress,
    chainId: tokenCondition?.chainID,
    enabled: Boolean(tokenCondition)
  });

  const { data: nftData } = useNFT({
    address: nftCondition?.contractAddress,
    chainId: nftCondition?.chainID,
    enabled: Boolean(nftCondition)
  });

  // Style
  const cardClasses = 'text-sm rounded-xl w-fit p-9 shadow-sm bg-gradient-to-tr from-brand-400 to-brand-600';

  // Status
  // Collect checks - https://docs.lens.xyz/docs/gated#collected-publication
  const hasNotCollectedPublication = reasons?.includes(DecryptFailReason.HasNotCollectedPublication);
  const collectNotFinalisedOnChain =
    !hasNotCollectedPublication && reasons?.includes(DecryptFailReason.CollectNotFinalisedOnChain);
  // Follow checks - https://docs.lens.xyz/docs/gated#profile-follow
  const doesNotFollowProfile = reasons?.includes(DecryptFailReason.DoesNotFollowProfile);
  const followNotFinalisedOnChain =
    !doesNotFollowProfile && reasons?.includes(DecryptFailReason.FollowNotFinalisedOnChain);
  // Token check - https://docs.lens.xyz/docs/gated#erc20-token-ownership
  const unauthorizedBalance = reasons?.includes(DecryptFailReason.UnauthorizedBalance);
  // NFT check - https://docs.lens.xyz/docs/gated#erc20-token-ownership
  const doesNotOwnNft = reasons?.includes(DecryptFailReason.DoesNotOwnNft);

  const getDecryptedData = async () => {
    if (!signer || isDecrypting) {
      return;
    }

    setIsDecrypting(true);
    const contentUri = getIPFSLink(encryptedPublication?.onChainContentURI);
    const { data } = await axios.get(contentUri);
    const sdk = await LensGatedSDK.create({ provider, signer, env: LIT_PROTOCOL_ENVIRONMENT as any });
    const { decrypted, error } = await sdk.gated.decryptMetadata(data);
    setDecryptedData(decrypted);
    setDecryptError(error);
    setIsDecrypting(false);
  };

  useEffect(() => {
    const lensLitAuthSig = localStorage.getItem('lens-lit-authsig');

    if (lensLitAuthSig) {
      getDecryptedData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentProfile) {
    return (
      <Card
        className={clsx(cardClasses, '!cursor-pointer')}
        onClick={(event) => {
          event.stopPropagation();
          setShowAuthModal(true);
        }}
      >
        <div className="text-white font-bold flex items-center space-x-1">
          <LogoutIcon className="h-5 w-5" />
          <span>Login to decrypt</span>
        </div>
      </Card>
    );
  }

  if (!canDecrypt) {
    return (
      <Card className={clsx(cardClasses, 'cursor-text')} onClick={(event) => event.stopPropagation()}>
        <div className="font-bold flex items-center space-x-2">
          <LockClosedIcon className="h-5 w-5 text-green-300" />
          <span className="text-white font-black text-base">
            <Trans>To view this...</Trans>
          </span>
        </div>
        <div className="pt-3.5 space-y-2 text-white">
          {/* Collect checks */}
          {hasNotCollectedPublication && (
            <DecryptMessage icon={<CollectionIcon className="h-4 w-4" />}>
              Collect the{' '}
              <Link
                href={`/posts/${collectCondition?.publicationId}`}
                className="font-bold lowercase underline"
                onClick={() => Analytics.track(PUBLICATION.TOKEN_GATED.CHECKLIST_NAVIGATED_TO_COLLECT)}
              >
                {encryptedPublication?.__typename}
              </Link>
            </DecryptMessage>
          )}
          {collectNotFinalisedOnChain && (
            <DecryptMessage icon={<CollectionIcon className="animate-pulse h-4 w-4" />}>
              <Trans>Collect finalizing on chain...</Trans>
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
              <Trans>Follow finalizing on chain...</Trans>
            </DecryptMessage>
          )}

          {/* Token check */}
          {unauthorizedBalance && (
            <DecryptMessage icon={<DatabaseIcon className="h-4 w-4" />}>
              You need{' '}
              <a
                href={`${POLYGONSCAN_URL}/token/${tokenCondition.contractAddress}`}
                className="font-bold underline"
                onClick={() => Analytics.track(PUBLICATION.TOKEN_GATED.CHECKLIST_NAVIGATED_TO_TOKEN)}
                target="_blank"
                rel="noreferrer"
              >
                {tokenCondition.amount} {tokenData?.symbol}
              </a>{' '}
              to unlock
            </DecryptMessage>
          )}

          {/* NFT check */}
          {doesNotOwnNft && (
            <DecryptMessage icon={<PhotographIcon className="h-4 w-4" />}>
              You need{' '}
              <Tooltip content={nftData?.contractMetadata?.name} placement="top">
                <a
                  href={`${RARIBLE_URL}/collection/polygon/${nftCondition.contractAddress}/items`}
                  className="font-bold underline"
                  onClick={() => Analytics.track(PUBLICATION.TOKEN_GATED.CHECKLIST_NAVIGATED_TO_NFT)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {nftData?.contractMetadata?.symbol}
                </a>
              </Tooltip>{' '}
              nft to unlock
            </DecryptMessage>
          )}
        </div>
      </Card>
    );
  }

  if (decryptError) {
    return <ErrorMessage title={t`Error while decrypting!`} error={decryptError} />;
  }

  if (!decryptedData && isDecrypting) {
    return (
      <div className="space-y-2">
        <div className="w-7/12 h-3 rounded-lg shimmer" />
        <div className="w-1/3 h-3 rounded-lg shimmer" />
      </div>
    );
  }

  if (!decryptedData) {
    return (
      <Card
        className={clsx(cardClasses, '!cursor-pointer')}
        onClick={(event) => {
          event.stopPropagation();
          getDecryptedData();
          Analytics.track(PUBLICATION.TOKEN_GATED.DECRYPT);
        }}
      >
        <div className="text-white font-bold flex items-center space-x-1">
          <FingerPrintIcon className="h-5 w-5" />
          <span>
            Decrypt <span className="lowercase">{encryptedPublication.__typename}</span>
          </span>
        </div>
      </Card>
    );
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
          <Link href={`/posts/${encryptedPublication?.id}`}>
            <Trans>Show more</Trans>
          </Link>
        </div>
      )}
      {publication?.media?.length ? (
        <Attachments attachments={publication?.media} />
      ) : publication?.content ? (
        getURLs(publication?.content)?.length > 0 && <IFramely url={getURLs(publication?.content)[0]} />
      ) : null}
    </div>
  );
};

export default DecryptedPublicationBody;
