import type {
  MirrorablePublication,
  UnknownOpenActionModuleSettings
} from '@hey/lens';
import type { FC } from 'react';

import getNftOpenActionKit from '@helpers/getNftOpenActionKit';
import isFeatureAvailable from '@helpers/isFeatureAvailable';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import getURLs from '@hey/helpers/getURLs';
import { useQuery } from '@tanstack/react-query';
import { HEY_REFERRAL_PROFILE_ID } from 'src/constants';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';

import DecentOpenAction from './UnknownModule/Decent';
import RentableBillboardOpenAction from './UnknownModule/RentableBillboard';
import SwapOpenAction from './UnknownModule/Swap';

interface OpenActionOnBodyProps {
  publication: MirrorablePublication;
}

const OpenActionOnBody: FC<OpenActionOnBodyProps> = ({ publication }) => {
  const { publicationContent } = usePublicationStore();

  const module = publication.openActionModules.find(
    (module) =>
      module.contract.address === VerifiedOpenActionModules.Swap ||
      module.contract.address === VerifiedOpenActionModules.RentableBillboard ||
      module.contract.address === VerifiedOpenActionModules.DecentNFT
  );
  const urls = getURLs(publicationContent);

  const fetchnftOpenActionEmbed = async (
    publicationContent: string
  ): Promise<any | undefined> => {
    const nftOpenActionKit = getNftOpenActionKit();
    const publicationContentUrls = getURLs(publicationContent);

    try {
      const calldata = await nftOpenActionKit.detectAndReturnCalldata({
        contentURI: publicationContentUrls[0],
        publishingClientProfileId: HEY_REFERRAL_PROFILE_ID
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

  if (!module) {
    return null;
  }

  return (
    <div className="mt-3">
      {module.contract.address === VerifiedOpenActionModules.Swap && (
        <SwapOpenAction
          module={module as UnknownOpenActionModuleSettings}
          publication={publication}
        />
      )}
      {isFeatureAvailable('rent-ads') &&
        module.contract.address ===
          VerifiedOpenActionModules.RentableBillboard && (
          <RentableBillboardOpenAction
            module={module as UnknownOpenActionModuleSettings}
            publication={publication}
          />
        )}
      {module?.contract.address === VerifiedOpenActionModules.DecentNFT && (
        <DecentOpenAction
          nftOpenActionEmbed={nftOpenActionEmbed}
          nftOpenActionEmbedLoading={nftOpenActionEmbedLoading}
          publication={publication}
          url={urls[0]}
        />
      )}
    </div>
  );
};

export default OpenActionOnBody;
