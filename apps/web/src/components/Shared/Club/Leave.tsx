import type { FC } from 'react';

import errorToast from '@helpers/errorToast';
import { HEY_API_URL } from '@hey/data/constants';
import { Button } from '@hey/ui';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useLensAuthData from 'src/hooks/useLensAuthData';

interface LeaveProps {
  id: string;
  setJoined: (joined: boolean) => void;
  small: boolean;
}

const Leave: FC<LeaveProps> = ({ id, setJoined, small }) => {
  const [isLoading, setIsLoading] = useState(false);
  const lensAuthData = useLensAuthData();

  const handleLeave = async () => {
    try {
      setIsLoading(true);
      await axios.post(
        `${HEY_API_URL}/clubs/leave`,
        { id },
        { headers: { ...lensAuthData } }
      );

      toast.success('Left club successfully!');
      setJoined(false);
    } catch (error) {
      errorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      aria-label="Joined"
      disabled={isLoading}
      onClick={handleLeave}
      outline
      size={small ? 'sm' : 'md'}
    >
      Joined
    </Button>
  );
};

export default Leave;
