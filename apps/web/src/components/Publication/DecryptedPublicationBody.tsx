import Attachments from '@components/Shared/Attachments';
import IFramely from '@components/Shared/IFramely';
import Markup from '@components/Shared/Markup';
import type { LensterPublication } from '@generated/types';
import { EyeIcon } from '@heroicons/react/outline';
import { LensEnvironment, LensGatedSDK } from '@lens-protocol/sdk-gated';
import getURLs from '@lib/getURLs';
import axios from 'axios';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import { useProvider, useSigner } from 'wagmi';

interface Props {
  publication: LensterPublication;
}

const DecryptedPublicationBody: FC<Props> = ({ publication }) => {
  const { pathname } = useRouter();
  const [decryptedData, setDecryptedData] = useState<any>(null);
  const provider = useProvider();
  const { data: signer } = useSigner();

  const canDecrypt = publication?.canDecrypt?.result;
  const showMore = publication?.metadata?.content?.length > 450 && pathname !== '/posts/[id]';

  const getDecryptedData = async () => {
    if (!signer) {
      return;
    }

    const contentUri = publication?.onChainContentURI;
    const { data } = await axios.get(contentUri);
    const sdk = await LensGatedSDK.create({ provider, signer, env: LensEnvironment.Mumbai });
    const { decrypted } = await sdk.gated.decryptMetadata(data);
    setDecryptedData(decrypted);
  };

  if (!canDecrypt) {
    return <div>To view...</div>;
  }

  return (
    <div className="break-words">
      <button
        onClick={async (event) => {
          event.stopPropagation();
          await getDecryptedData();
        }}
      >
        Unlock
      </button>
      {JSON.stringify(decryptedData)}
      <Markup
        className={clsx(
          { 'line-clamp-5': showMore },
          'whitespace-pre-wrap break-words leading-md linkify text-md'
        )}
      >
        {publication?.metadata?.content}
      </Markup>
      {showMore && (
        <div className="mt-4 text-sm text-gray-500 font-bold flex items-center space-x-1">
          <EyeIcon className="h-4 w-4" />
          <Link href={`/posts/${publication?.id}`}>Show more</Link>
        </div>
      )}
      {publication?.metadata?.media?.length > 0 ? (
        <Attachments attachments={publication?.metadata?.media} publication={publication} />
      ) : (
        publication?.metadata?.content &&
        getURLs(publication?.metadata?.content)?.length > 0 && (
          <IFramely url={getURLs(publication?.metadata?.content)[0]} />
        )
      )}
    </div>
  );
};

export default DecryptedPublicationBody;
