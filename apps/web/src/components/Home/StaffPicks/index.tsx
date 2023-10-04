import GroupProfileShimmer from '@components/Shared/Shimmer/GroupProfileShimmer';
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import { CursorArrowRippleIcon as CursorArrowRippleIconOutline } from '@heroicons/react/24/outline';
import { CursorArrowRippleIcon as CursorArrowRippleIconSolid } from '@heroicons/react/24/solid';
import { STAFF_PICKS_WORKER_URL } from '@hey/data/constants';
import type { StaffPick } from '@hey/types/hey';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { t, Trans } from '@lingui/macro';
import axios from 'axios';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useQuery } from 'wagmi';

import StaffPickedGroup from './StaffPickedGroup';
import StaffPickedProfile from './StaffPickedProfile';

const Title = () => {
  return (
    <div className="mb-2 flex items-center gap-2 px-5 sm:px-0">
      <CursorArrowRippleIconSolid className="text-brand h-4 w-4" />
      <div>
        <Trans>What's poppin'?</Trans>
      </div>
    </div>
  );
};

const StaffPicks: FC = () => {
  const fetchStaffPicks = async (): Promise<StaffPick[]> => {
    const response: {
      data: { result: StaffPick[] };
    } = await axios.get(`${STAFF_PICKS_WORKER_URL}/all`);

    return response.data.result;
  };

  const {
    data: picks,
    isLoading,
    error
  } = useQuery(['fetchStaffPicks'], () => fetchStaffPicks().then((res) => res));

  if (isLoading) {
    return (
      <>
        <Title />
        <Card className="mb-4 space-y-4 p-5">
          <UserProfileShimmer />
          <GroupProfileShimmer />
          <UserProfileShimmer />
          <GroupProfileShimmer />
          <UserProfileShimmer />
        </Card>
      </>
    );
  }

  if (picks?.length === 0) {
    return (
      <div className="mb-4">
        <Title />
        <EmptyState
          message={t`Nothing here!`}
          icon={<CursorArrowRippleIconOutline className="text-brand h-8 w-8" />}
        />
      </div>
    );
  }

  return (
    <>
      <Title />
      <Card as="aside" className="mb-4">
        <div className="space-y-4 p-5">
          <ErrorMessage
            title={t`Failed to load recommendations`}
            error={error as Error}
          />
          {picks?.map((pick) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={pick.id}
              className="flex items-center space-x-3 truncate"
            >
              {pick.type === 'PROFILE' && <StaffPickedProfile id={pick.id} />}
              {pick.type === 'GROUP' && <StaffPickedGroup id={pick.id} />}
            </motion.div>
          ))}
        </div>
      </Card>
    </>
  );
};

export default StaffPicks;
