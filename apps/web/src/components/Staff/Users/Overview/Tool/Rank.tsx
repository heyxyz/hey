import MetaDetails from "@components/Shared/MetaDetails";
import {
  CurrencyDollarIcon,
  HandRaisedIcon,
  UserCircleIcon,
  UserIcon,
  UserPlusIcon
} from "@heroicons/react/24/outline";
import { HashtagIcon } from "@heroicons/react/24/solid";
import { H5 } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";
import urlcat from "urlcat";

const GET_RANK_QUERY_KEY = "getRank";

interface RankProps {
  handle?: string;
  lensClassifierScore: number;
  accountId: string;
}

const Rank: FC<RankProps> = ({ handle, lensClassifierScore, accountId }) => {
  const getRank = async (strategy: string) => {
    try {
      const { data } = await axios.get(
        urlcat("https://lens-api.k3l.io/profile/rank", { handle, strategy })
      );

      return data;
    } catch {
      return false;
    }
  };

  const { data: followship, isLoading: followshipLoading } = useQuery({
    queryFn: async () => await getRank("followship"),
    queryKey: [GET_RANK_QUERY_KEY, accountId, "followship"]
  });

  const { data: engagement, isLoading: engagementLoading } = useQuery({
    queryFn: async () => await getRank("engagement"),
    queryKey: [GET_RANK_QUERY_KEY, accountId, "engagement"]
  });

  const { data: influencer, isLoading: influencerLoading } = useQuery({
    queryFn: async () => await getRank("influencer"),
    queryKey: [GET_RANK_QUERY_KEY, accountId, "influencer"]
  });

  const { data: creator, isLoading: creatorLoading } = useQuery({
    queryFn: async () => await getRank("creator"),
    queryKey: [GET_RANK_QUERY_KEY, accountId, "creator"]
  });

  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <HashtagIcon className="size-5" />
        <H5>Rankings</H5>
      </div>
      <div className="mt-3 space-y-2">
        <MetaDetails
          icon={<UserIcon className="ld-text-gray-500 size-4" />}
          title="Lens Classifier Score"
        >
          {lensClassifierScore}
        </MetaDetails>
        <MetaDetails
          icon={<UserPlusIcon className="ld-text-gray-500 size-4" />}
          title="Followship Rank"
        >
          {followshipLoading ? (
            <div className="shimmer h-4 w-5 rounded" />
          ) : followship ? (
            followship.rank
          ) : (
            "Not ranked"
          )}
        </MetaDetails>
        <MetaDetails
          icon={<HandRaisedIcon className="ld-text-gray-500 size-4" />}
          title="Engagement Rank"
        >
          {engagementLoading ? (
            <div className="shimmer h-4 w-5 rounded" />
          ) : engagement ? (
            engagement.rank
          ) : (
            "Not ranked"
          )}
        </MetaDetails>
        <MetaDetails
          icon={<UserCircleIcon className="ld-text-gray-500 size-4" />}
          title="Influencer Rank"
        >
          {influencerLoading ? (
            <div className="shimmer h-4 w-5 rounded" />
          ) : influencer ? (
            influencer.rank
          ) : (
            "Not ranked"
          )}
        </MetaDetails>
        <MetaDetails
          icon={<CurrencyDollarIcon className="ld-text-gray-500 size-4" />}
          title="Creator Rank"
        >
          {creatorLoading ? (
            <div className="shimmer h-4 w-5 rounded" />
          ) : creator ? (
            creator.rank
          ) : (
            "Not ranked"
          )}
        </MetaDetails>
      </div>
    </>
  );
};

export default Rank;
