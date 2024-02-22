import type { StaffPick } from '@hey/types/hey';
import type { FC } from 'react';

import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import { CursorArrowRippleIcon as CursorArrowRippleIconOutline } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';

import StaffPickedProfile from './StaffPickedProfile';

const Title: FC = () => <p className="text-lg font-semibold">Staff Picks</p>;

const StaffPicks: FC = () => {
  const fetchStaffPicks = async (): Promise<StaffPick[]> => {
    const response: {
      data: { result: StaffPick[] };
    } = await axios.get(`${HEY_API_URL}/staff-picks`);

    return response.data.result;
  };

  const {
    data: picks,
    error,
    isLoading
  } = useQuery({ queryFn: fetchStaffPicks, queryKey: ['fetchStaffPicks'] });

  if (isLoading) {
    return (
      <Card as="aside" className="mb-4 space-y-4 p-5">
        <Title />
        <UserProfileShimmer />
        <UserProfileShimmer />
        <UserProfileShimmer />
        <UserProfileShimmer />
        <UserProfileShimmer />
      </Card>
    );
  }

  if (picks?.length === 0) {
    return (
      <Card as="aside" className="mb-4 p-5">
        <Title />
        <EmptyState
          hideCard
          icon={
            <CursorArrowRippleIconOutline className="text-brand-500 size-8" />
          }
          message="Nothing here!"
        />
      </Card>
    );
  }

  return (
    <Card as="aside" className="mb-4 space-y-4 p-5">
      <Title />
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
          <StaffPickedProfile id={pick.id} />
        </motion.div>
      ))}
    </Card>
  );
};

export default StaffPicks;
