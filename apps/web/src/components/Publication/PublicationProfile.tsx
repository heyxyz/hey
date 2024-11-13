import Source from "@components/Publication/Source";
import Misuse from "@components/Shared/Profile/Icons/Misuse";
import Verified from "@components/Shared/Profile/Icons/Verified";
import formatRelativeOrAbsolute from "@hey/helpers/datetime/formatRelativeOrAbsolute";
import getProfile from "@hey/helpers/getProfile";
import type { Profile } from "@hey/lens";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import { memo } from "react";
import ProfilePreview from "../Shared/ProfilePreview";
import Slug from "../Shared/Slug";
import ClubHandle from "./ClubHandle";

interface FeedUserProfileProps {
  profile: Profile;
  postId: string;
  source?: string;
  tags: string[];
  timestamp: Date;
}

const PublicationProfile: FC<FeedUserProfileProps> = ({
  profile,
  postId,
  source,
  tags,
  timestamp
}) => {
  const WrappedLink = ({ children }: { children: ReactNode }) => (
    <Link
      className="outline-none hover:underline focus:underline"
      href={getProfile(profile).link}
    >
      <ProfilePreview
        handle={profile.handle?.fullHandle}
        id={profile.id}
        showUserPreview
      >
        {children}
      </ProfilePreview>
    </Link>
  );

  return (
    <div className="flex flex-wrap items-center gap-x-1">
      <WrappedLink>
        <span className="font-semibold">{getProfile(profile).displayName}</span>
      </WrappedLink>
      <WrappedLink>
        <Slug className="text-sm" slug={getProfile(profile).slugWithPrefix} />
      </WrappedLink>
      <Verified id={profile.id} iconClassName="size-4" />
      <Misuse id={profile.id} iconClassName="size-4" />
      {timestamp ? (
        <span className="ld-text-gray-500">
          <span className="mr-1">·</span>
          <Link className="text-xs hover:underline" href={`/posts/${postId}`}>
            {formatRelativeOrAbsolute(timestamp)}
          </Link>
        </span>
      ) : null}
      <ClubHandle tags={tags} />
      <Source publishedOn={source} />
    </div>
  );
};

export default memo(PublicationProfile);
