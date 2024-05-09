import type {
  MirrorablePublication,
  UnknownOpenActionModuleSettings
} from '@hey/lens';

import Oembed from '@components/Shared/Oembed';
import isFeatureAvailable from '@helpers/isFeatureAvailable';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { KNOWN_ATTRIBUTES } from '@hey/data/constants';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import getURLs from '@hey/helpers/getURLs';
import { MetadataAttributeType } from '@lens-protocol/metadata';
import { type FC, useEffect } from 'react';
import { usePublicationAttachmentStore } from 'src/store/non-persisted/publication/usePublicationAttachmentStore';
import { usePublicationAttributesStore } from 'src/store/non-persisted/publication/usePublicationAttributesStore';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';

import RentableBillboardOpenAction from './UnknownModule/RentableBillboard';
import SwapOpenAction from './UnknownModule/Swap';

interface OpenActionOnBodyProps {
  nftOpenActionEmbed?: boolean;
  nftOpenActionEmbedLoading?: boolean;
  publication: MirrorablePublication;
}

const OpenActionOnBody: FC<OpenActionOnBodyProps> = ({
  nftOpenActionEmbed,
  nftOpenActionEmbedLoading,
  publication
}) => {
  const module = publication?.openActionModules.find(
    (module) =>
      module.contract.address === VerifiedOpenActionModules.Swap ||
      module.contract.address === VerifiedOpenActionModules.RentableBillboard ||
      module.contract.address === VerifiedOpenActionModules.DecentNFT
  );

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

  if (
    !urls.length ||
    attachments.length ||
    quotedPublication ||
    getAttribute(KNOWN_ATTRIBUTES.HIDE_OEMBED)?.value === 'true'
  ) {
    return null;
  }

  if (!module && !nftOpenActionEmbed && Boolean(publication)) {
    return null;
  }

  return (
    <div className="mt-3">
      {module?.contract.address === VerifiedOpenActionModules.Swap && (
        <SwapOpenAction
          module={module as UnknownOpenActionModuleSettings}
          publication={publication as MirrorablePublication}
        />
      )}
      {isFeatureAvailable('rent-ads') &&
        module?.contract.address ===
          VerifiedOpenActionModules.RentableBillboard && (
          <RentableBillboardOpenAction />
        )}
      {(module?.contract.address === VerifiedOpenActionModules.DecentNFT ||
        nftOpenActionEmbed) && (
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
      )}
    </div>
  );
};

export default OpenActionOnBody;
