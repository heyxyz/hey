import SwapOpenAction from '@components/Publication/OpenAction/UnknownModule/Swap';
import Oembed from '@components/Shared/Oembed';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { KNOWN_ATTRIBUTES } from '@hey/data/constants';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import getURLs from '@hey/helpers/getURLs';
import { type UnknownOpenActionModuleSettings } from '@hey/lens';
import { MetadataAttributeType } from '@lens-protocol/metadata';
import { type FC, useEffect } from 'react';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';
import { usePublicationAttachmentStore } from 'src/store/non-persisted/publication/usePublicationAttachmentStore';
import { usePublicationAttributesStore } from 'src/store/non-persisted/publication/usePublicationAttributesStore';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';

type OpenActionsProps = {
  nftOpenActionEmbed?: boolean;
  nftOpenActionEmbedLoading?: boolean;
};

const OpenActions: FC<OpenActionsProps> = ({
  nftOpenActionEmbed,
  nftOpenActionEmbedLoading
}) => {
  const { openAction, reset } = useOpenActionStore();

  const { publicationContent, quotedPublication } = usePublicationStore();
  const { attachments } = usePublicationAttachmentStore((state) => state);
  const { addAttribute, getAttribute, removeAttribute } =
    usePublicationAttributesStore();

  const urls = getURLs(publicationContent);

  useEffect(() => {
    if (urls.length) {
      removeAttribute(KNOWN_ATTRIBUTES.HIDE_OEMBED);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urls.length]);

  const hasSwapOpenAction =
    openAction?.address === VerifiedOpenActionModules.Swap;

  if (
    !urls.length ||
    attachments.length ||
    quotedPublication ||
    getAttribute(KNOWN_ATTRIBUTES.HIDE_OEMBED)?.value === 'true'
  ) {
    return null;
  }

  if (Boolean(nftOpenActionEmbed)) {
    return (
      <div className="relative m-5">
        <Oembed
          nftOpenActionEmbed={nftOpenActionEmbed}
          nftOpenActionEmbedLoading={nftOpenActionEmbedLoading}
          url={urls[0]}
        />
        <div className="absolute top-0 m-3">
          <button
            className="rounded-full bg-gray-900 p-1.5 opacity-75"
            onClick={() =>
              addAttribute({
                key: KNOWN_ATTRIBUTES.HIDE_OEMBED,
                type: MetadataAttributeType.BOOLEAN,
                value: 'true'
              })
            }
            type="button"
          >
            <XMarkIcon className="size-4 text-white" />
          </button>
        </div>
      </div>
    );
  }

  if (!hasSwapOpenAction) {
    return null;
  }

  return (
    <div className="relative m-5 w-fit">
      <SwapOpenAction
        module={
          {
            contract: { address: openAction.address },
            initializeCalldata: openAction.data
          } as UnknownOpenActionModuleSettings
        }
      />
      <div className="absolute -right-5 -top-5 m-2">
        <button
          className="rounded-full bg-gray-900 p-1.5 opacity-75"
          onClick={() => reset()}
          type="button"
        >
          <XMarkIcon className="size-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default OpenActions;
