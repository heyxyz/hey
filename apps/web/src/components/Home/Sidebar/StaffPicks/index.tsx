import type { StaffPick } from '@hey/types/hey';
import type { FC } from 'react';

import GroupProfileShimmer from '@components/Shared/Shimmer/GroupProfileShimmer';
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import { CursorArrowRippleIcon as CursorArrowRippleIconOutline } from '@heroicons/react/24/outline';
import { CursorArrowRippleIcon as CursorArrowRippleIconSolid } from '@heroicons/react/24/solid';
import { HEY_API_URL } from '@hey/data/constants';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useQuery } from 'wagmi';

import StaffPickedGroup from './StaffPickedGroup';
import StaffPickedProfile from './StaffPickedProfile';

const Title = () => {
  return (
    <div className="mb-2 flex items-center gap-2 px-5 sm:px-0">
      <CursorArrowRippleIconSolid className="text-brand-500 size-4" />
      <div>What's poppin'?</div>
    </div>
  );
};

const StaffPicks: FC = () => {
  const fetchStaffPicks = async (): Promise<StaffPick[]> => {
    const response: {
      data: { result: StaffPick[] };
    } = await axios.get(`${HEY_API_URL}/staff-pick/getStaffPicks`);

    return response.data.result;
  };

  const {
    data: picks,
    error,
    isLoading
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
          icon={
            <CursorArrowRippleIconOutline className="text-brand-500 size-8" />
          }
          message="Nothing here!"
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
            error={error as Error}
            title="Failed to load recommendations"
          />
          {picks?.map((pick) => (
            <motion.div
              animate={{ opacity: 1 }}
              className="flex items-center space-x-3 truncate"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key={pick.id}
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
