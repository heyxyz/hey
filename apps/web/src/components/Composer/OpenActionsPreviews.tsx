import type { OG } from '@hey/types/misc';
import type { FC } from 'react';

import DecentOpenActionPreview from '@components/Publication/OpenAction/UnknownModule/Decent/DecentOpenActionPreview';
import getNftOpenActionKit from '@helpers/getNftOpenActionKit';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  HEY_API_URL,
  KNOWN_ATTRIBUTES,
  REWARDS_PROFILE_ID
} from '@hey/data/constants';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import getFavicon from '@hey/helpers/getFavicon';
import getURLs from '@hey/helpers/getURLs';
import { MetadataAttributeType } from '@lens-protocol/metadata';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { usePublicationAttachmentStore } from 'src/store/non-persisted/publication/usePublicationAttachmentStore';
import { usePublicationAttributesStore } from 'src/store/non-persisted/publication/usePublicationAttributesStore';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';

interface OpenActionsPreviewsProps {
  setNftOpenActionEmbed: (nftOpenActionEmbed: any) => void;
}

const OpenActionsPreviews: FC<OpenActionsPreviewsProps> = ({
  setNftOpenActionEmbed
}) => {
  const { publicationContent, quotedPublication } = usePublicationStore();
  const { attachments } = usePublicationAttachmentStore((state) => state);
  const { addAttribute, getAttribute, removeAttribute } =
    usePublicationAttributesStore();

  const urls = getURLs(publicationContent);
  const url = urls?.[0] || '';

  const fetchnftOpenActionEmbed = async (
    publicationContent: string
  ): Promise<any | undefined> => {
    const nftOpenActionKit = getNftOpenActionKit();
    const publicationContentUrls = getURLs(publicationContent);

    try {
      const calldata = await nftOpenActionKit.detectAndReturnCalldata({
        contentURI: publicationContentUrls[0],
        publishingClientProfileId: REWARDS_PROFILE_ID
      });

      if (calldata) {
        return {
          unknownOpenAction: {
            address: VerifiedOpenActionModules.DecentNFT,
            data: calldata
          }
        };
      } else {
        return undefined;
      }
    } catch (error) {
      console.error('Error fetching open action embed:', error);
      return undefined;
    }
  };

  const { data: nftOpenActionEmbed, isLoading: nftOpenActionEmbedLoading } =
    useQuery({
      enabled: Boolean(publicationContent),
      queryFn: () => fetchnftOpenActionEmbed(publicationContent),
      queryKey: ['fetchnftOpenActionEmbed', publicationContent]
    });

  const { data } = useQuery({
    enabled: Boolean(url),
    queryFn: async () => {
      const response = await axios.get(`${HEY_API_URL}/oembed`, {
        params: { url }
      });
      return response.data.oembed;
    },
    queryKey: ['getOembed', url],
    refetchOnMount: false
  });

  useEffect(() => {
    if (urls.length) {
      removeAttribute(KNOWN_ATTRIBUTES.HIDE_OEMBED);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urls.length]);

  useEffect(() => {
    if (nftOpenActionEmbed) {
      setNftOpenActionEmbed(nftOpenActionEmbed);
    } else {
      setNftOpenActionEmbed(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nftOpenActionEmbed]);

  const og: OG = {
    description: data?.description,
    favicon: data?.url ? getFavicon(data.url) : '',
    frame: data?.frame,
    html: data?.html,
    image: data?.image,
    nft: data?.nft,
    site: data?.site,
    title: data?.title,
    url: url as string
  };

  if (
    !nftOpenActionEmbed ||
    !urls.length ||
    attachments.length ||
    quotedPublication ||
    getAttribute(KNOWN_ATTRIBUTES.HIDE_OEMBED)?.value === 'true'
  ) {
    return null;
  }

  if (nftOpenActionEmbed) {
    return (
      <div className="relative m-5">
        <DecentOpenActionPreview
          og={og}
          openActionEmbedLoading={nftOpenActionEmbedLoading}
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

  return null;
};

export default OpenActionsPreviews;
