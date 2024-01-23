import type { FC } from 'react';

import { ShieldCheckIcon } from '@heroicons/react/24/solid';
import { HEY_API_URL } from '@hey/data/constants';
import humanize from '@hey/lib/humanize';
import { Tooltip } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface TrustedBadgeProps {
  id: string;
}

const TrustedBadge: FC<TrustedBadgeProps> = ({ id }) => {
  const getTrustedProfileStatus = async (): Promise<{
    isTrusted: boolean;
    resolvedCount: number;
  }> => {
    if (!id) {
      return { isTrusted: false, resolvedCount: 0 };
    }

    const response = await axios.get(`${HEY_API_URL}/trusted/status`, {
      params: { id }
    });
    const { data } = response;

    return data;
  };

  const { data } = useQuery({
    queryFn: getTrustedProfileStatus,
    queryKey: ['getTrustedProfileStatus', id]
  });

  if (!data) {
    return null;
  }

  const { isTrusted, resolvedCount } = data;

  if (!isTrusted) {
    return null;
  }

  return (
    <Tooltip
      content={
        <span>
          Trusted profile: <b>{humanize(resolvedCount)} reports resolved</b>
        </span>
      }
    >
      <ShieldCheckIcon className="size-6 text-blue-500" />
    </Tooltip>
  );
};

export default TrustedBadge;
