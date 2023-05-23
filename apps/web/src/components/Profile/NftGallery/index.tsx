import NftGalleryShimmer from '@components/Shared/Shimmer/NftGalleryShimmer';
import type { NftGallery, Profile } from 'lens';
import { useNftGalleriesQuery } from 'lens';
import type { FC } from 'react';

import Gallery from './Gallery';
import NoGallery from './NoGallery';

interface NftGalleryHomeProps {
  profile: Profile;
}

const NftGalleryHome: FC<NftGalleryHomeProps> = ({ profile }) => {
  const { data, loading } = useNftGalleriesQuery({
    variables: { request: { profileId: profile?.id } }
  });

  const nftGalleries = data?.nftGalleries as NftGallery[];

  if (loading) {
    return <NftGalleryShimmer />;
  }

  if (!nftGalleries?.length) {
    return <NoGallery profile={profile} />;
  }

  return (
    <div className="space-y-4">
      <Gallery galleries={nftGalleries} />
    </div>
  );
};

export default NftGalleryHome;
