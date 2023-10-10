import Attachments from '@components/Shared/Attachments';
import Markup from '@components/Shared/Markup';
import Oembed from '@components/Shared/Oembed';
import {
  ArrowRightOnRectangleIcon,
  CircleStackIcon,
  EyeIcon,
  FingerPrintIcon,
  PhotoIcon,
  RectangleStackIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import {
  LIT_PROTOCOL_ENVIRONMENT,
  POLYGONSCAN_URL,
  RARIBLE_URL
} from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import type { Publication, PublicationMetadataV2Input } from '@hey/lens';
import { DecryptFailReason, useCanDecryptStatusQuery } from '@hey/lens';
import formatHandle from '@hey/lib/formatHandle';
import getURLs from '@hey/lib/getURLs';
import removeUrlAtEnd from '@hey/lib/removeUrlAtEnd';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Card, ErrorMessage, Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import type { LensEnvironment } from '@lens-protocol/sdk-gated';
import { LensGatedSDK } from '@lens-protocol/sdk-gated';
import type {
  CollectConditionOutput,
  Erc20OwnershipOutput,
  NftOwnershipOutput
} from '@lens-protocol/sdk-gated/dist/graphql/types';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { isIOS, isMobile } from 'react-device-detect';
import useContractMetadata from 'src/hooks/useContractMetadata';
import useEthersWalletClient from 'src/hooks/useEthersWalletClient';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';
import { usePublicClient, useToken } from 'wagmi';

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

interface DecryptedPublicationBodyProps {
  encryptedPublication: Publication;
}

const DecryptedPublicationBody: FC<DecryptedPublicationBodyProps> = ({
  encryptedPublication
}) => {
  const [content, setContent] = useState<any>();
  const { pathname } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );
  const [decryptedData, setDecryptedData] = useState<any>(null);
  const [decryptError, setDecryptError] = useState<any>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [canDecrypt, setCanDecrypt] = useState<boolean>(
    encryptedPublication?.canDecrypt?.result
  );
  const [reasons, setReasons] = useState<any>(
    encryptedPublication?.canDecrypt.reasons
  );
  const publicClient = usePublicClient();
  const { data: walletClient } = useEthersWalletClient();

  const showMore =
    encryptedPublication?.metadata?.content?.length > 450 &&
    pathname !== '/posts/[id]';

  useCanDecryptStatusQuery({
    variables: {
      request: { publicationId: encryptedPublication.id },
      profileId: currentProfile?.id ?? null
    },
    pollInterval: 5000,
    skip: canDecrypt || !currentProfile,
    onCompleted: ({ publication }) => {
      setCanDecrypt(publication?.canDecrypt.result || false);
      setReasons(publication?.canDecrypt.reasons || []);
    }
  });

  const getCondition = (key: string) => {
    const criteria: any =
      encryptedPublication.metadata.encryptionParams?.accessCondition.or
        ?.criteria;

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

  const { data: contractMetadata } = useContractMetadata({
    address: nftCondition?.contractAddress,
    chainId: nftCondition?.chainID,
    enabled: Boolean(nftCondition)
  });

  // Style
  const cardClasses =
    'text-sm rounded-xl w-fit p-9 shadow-sm bg-gradient-to-tr from-brand-400 to-brand-600';

  // Status
  // Collect checks - https://docs.lens.xyz/docs/gated#collected-publication
  const hasNotCollectedPublication = reasons?.includes(
    DecryptFailReason.HasNotCollectedPublication
  );
  const collectNotFinalisedOnChain =
    !hasNotCollectedPublication &&
    reasons?.includes(DecryptFailReason.CollectNotFinalisedOnChain);
  // Follow checks - https://docs.lens.xyz/docs/gated#profile-follow
  const doesNotFollowProfile = reasons?.includes(
    DecryptFailReason.DoesNotFollowProfile
  );
  const followNotFinalisedOnChain =
    !doesNotFollowProfile &&
    reasons?.includes(DecryptFailReason.FollowNotFinalisedOnChain);
  // Token check - https://docs.lens.xyz/docs/gated#erc20-token-ownership
  const unauthorizedBalance = reasons?.includes(
    DecryptFailReason.UnauthorizedBalance
  );
  // NFT check - https://docs.lens.xyz/docs/gated#erc20-token-ownership
  const doesNotOwnNft = reasons?.includes(DecryptFailReason.DoesNotOwnNft);

  const getDecryptedData = async () => {
    if (!walletClient || isDecrypting) {
      return;
    }

    setIsDecrypting(true);
    const contentUri = sanitizeDStorageUrl(
      encryptedPublication?.onChainContentURI
    );
    const { data } = await axios.get(contentUri);
    const sdk = await LensGatedSDK.create({
      provider: publicClient as any,
      signer: walletClient as any,
      env: LIT_PROTOCOL_ENVIRONMENT as LensEnvironment
    });
    const { decrypted, error } = await sdk.gated.decryptMetadata(data);
    setDecryptedData(decrypted);
    setContent(decrypted?.content);
    setDecryptError(error);
    setIsDecrypting(false);
  };

  if (isIOS && isMobile && showMore) {
    const truncatedContent = content?.split('\n')?.[0];
    if (truncatedContent) {
      setContent(truncatedContent);
    }
  }

  if (!currentProfile) {
    return (
      <Card
        className={cn(cardClasses, '!cursor-pointer')}
        onClick={(event) => {
          stopEventPropagation(event);
          setShowAuthModal(true);
        }}
      >
        <div className="flex items-center space-x-1 font-bold text-white">
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Login to decrypt</span>
        </div>
      </Card>
    );
  }

  if (!canDecrypt) {
    return (
      <Card
        className={cn(cardClasses, 'cursor-text')}
        onClick={stopEventPropagation}
      >
        <div className="flex items-center space-x-2 font-bold">
          <LockClosedIcon className="h-5 w-5 text-green-300" />
          <span className="text-base font-black text-white">
            <Trans>To view this...</Trans>
          </span>
        </div>
        <div className="space-y-2 pt-3.5 text-white">
          {/* Collect checks */}
          {hasNotCollectedPublication ? (
            <DecryptMessage icon={<RectangleStackIcon className="h-4 w-4" />}>
              Collect the{' '}
              <Link
                href={`/posts/${collectCondition?.publicationId}`}
                className="font-bold lowercase underline"
                onClick={() =>
                  Leafwatch.track(
                    PUBLICATION.TOKEN_GATED.CHECKLIST_NAVIGATED_TO_COLLECT
                  )
                }
              >
                {encryptedPublication?.__typename}
              </Link>
            </DecryptMessage>
          ) : null}
          {collectNotFinalisedOnChain ? (
            <DecryptMessage
              icon={<RectangleStackIcon className="h-4 w-4 animate-pulse" />}
            >
              <Trans>Collect finalizing on chain...</Trans>
            </DecryptMessage>
          ) : null}

          {/* Follow checks */}
          {doesNotFollowProfile ? (
            <DecryptMessage icon={<UserPlusIcon className="h-4 w-4" />}>
              Follow{' '}
              <Link
                href={`/u/${formatHandle(
                  encryptedPublication?.profile?.handle
                )}`}
                className="font-bold"
              >
                @{formatHandle(encryptedPublication?.profile?.handle)}
              </Link>
            </DecryptMessage>
          ) : null}
          {followNotFinalisedOnChain ? (
            <DecryptMessage
              icon={<UserPlusIcon className="h-4 w-4 animate-pulse" />}
            >
              <Trans>Follow finalizing on chain...</Trans>
            </DecryptMessage>
          ) : null}

          {/* Token check */}
          {unauthorizedBalance ? (
            <DecryptMessage icon={<CircleStackIcon className="h-4 w-4" />}>
              You need{' '}
              <Link
                href={`${POLYGONSCAN_URL}/token/${tokenCondition.contractAddress}`}
                className="font-bold underline"
                onClick={() =>
                  Leafwatch.track(
                    PUBLICATION.TOKEN_GATED.CHECKLIST_NAVIGATED_TO_TOKEN
                  )
                }
                target="_blank"
                rel="noreferrer noopener"
              >
                {tokenCondition.amount} {tokenData?.symbol}
              </Link>{' '}
              to unlock
            </DecryptMessage>
          ) : null}

          {/* NFT check */}
          {doesNotOwnNft ? (
            <DecryptMessage icon={<PhotoIcon className="h-4 w-4" />}>
              You need{' '}
              <Tooltip content={contractMetadata?.name} placement="top">
                <Link
                  href={`${RARIBLE_URL}/collection/polygon/${nftCondition.contractAddress}/items`}
                  className="font-bold underline"
                  onClick={() =>
                    Leafwatch.track(
                      PUBLICATION.TOKEN_GATED.CHECKLIST_NAVIGATED_TO_NFT
                    )
                  }
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {contractMetadata?.symbol}
                </Link>
              </Tooltip>{' '}
              nft to unlock
            </DecryptMessage>
          ) : null}
        </div>
      </Card>
    );
  }

  if (decryptError) {
    return (
      <ErrorMessage title={t`Error while decrypting!`} error={decryptError} />
    );
  }

  if (!decryptedData && isDecrypting) {
    return (
      <div className="space-y-2">
        <div className="shimmer h-3 w-7/12 rounded-lg" />
        <div className="shimmer h-3 w-1/3 rounded-lg" />
      </div>
    );
  }

  if (!decryptedData) {
    return (
      <Card
        className={cn(cardClasses, '!cursor-pointer')}
        onClick={async (event) => {
          stopEventPropagation(event);
          await getDecryptedData();
          Leafwatch.track(PUBLICATION.TOKEN_GATED.DECRYPT);
        }}
      >
        <div className="flex items-center space-x-1 font-bold text-white">
          <FingerPrintIcon className="h-5 w-5" />
          <span>
            Decrypt{' '}
            <span className="lowercase">{encryptedPublication.__typename}</span>
          </span>
        </div>
      </Card>
    );
  }

  const publication: PublicationMetadataV2Input = decryptedData;
  const urls = getURLs(content);

  const onData = () => {
    const updatedContent = removeUrlAtEnd(urls, content);
    if (updatedContent !== content) {
      setContent(updatedContent);
    }
  };

  return (
    <div className="break-words">
      <Markup
        className={cn(
          { 'line-clamp-5': showMore },
          'markup linkify text-md break-words'
        )}
      >
        {content}
      </Markup>
      {showMore ? (
        <div className="mt-4 flex items-center space-x-1 text-sm font-bold text-gray-500">
          <EyeIcon className="h-4 w-4" />
          <Link href={`/posts/${encryptedPublication?.id}`}>
            <Trans>Show more</Trans>
          </Link>
        </div>
      ) : null}
      {publication?.media?.length ? (
        <Attachments attachments={publication?.media} />
      ) : content && urls.length > 0 ? (
        <Oembed
          url={urls[0]}
          publicationId={encryptedPublication.id}
          onData={onData}
        />
      ) : null}
    </div>
  );
};

export default DecryptedPublicationBody;
