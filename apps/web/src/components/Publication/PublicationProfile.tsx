import Source from "@components/Publication/Source";
import isVerified from "@helpers/isVerified";
import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/solid";
import formatRelativeOrAbsolute from "@hey/helpers/datetime/formatRelativeOrAbsolute";
import getProfile from "@hey/helpers/getProfile";
import hasMisused from "@hey/helpers/hasMisused";
import type { Profile } from "@hey/lens";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import { memo } from "react";
import Slug from "../Shared/Slug";
import UserPreview from "../Shared/UserPreview";
import ClubHandle from "./ClubHandle";

interface FeedUserProfileProps {
  profile: Profile;
  publicationId: string;
  source?: string;
  tags: string[];
  timestamp: Date;
}

const PublicationProfile: FC<FeedUserProfileProps> = ({
  profile,
  publicationId,
  source,
  tags,
  timestamp
}) => {
  const WrappedLink = ({ children }: { children: ReactNode }) => (
    <Link
      className="truncate outline-none hover:underline focus:underline"
      href={getProfile(profile).link}
    >
      <UserPreview
        handle={profile.handle?.fullHandle}
        id={profile.id}
        showUserPreview
      >
        {children}
      </UserPreview>
    </Link>
  );

  return (
    <div className="flex max-w-sm flex-wrap items-center">
      <WrappedLink>
        <span className="font-semibold">{getProfile(profile).displayName}</span>
      </WrappedLink>
      <WrappedLink>
        <Slug
          className="ml-1 truncate text-sm"
          slug={getProfile(profile).slugWithPrefix}
        />
      </WrappedLink>
      {isVerified(profile.id) ? (
        <CheckBadgeIcon className="ml-1 size-4 text-brand-500" />
      ) : null}
      {hasMisused(profile.id) ? (
        <ExclamationCircleIcon className="ml-1 size-4" />
      ) : null}
      {timestamp ? (
        <span className="ld-text-gray-500 truncate">
          <span className="mx-1">·</span>
          <Link
            className="text-xs hover:underline"
            href={`/posts/${publicationId}`}
          >
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
