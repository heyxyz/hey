import type { FC } from 'react';

import errorToast from '@helpers/errorToast';
import { HEY_API_URL } from '@hey/data/constants';
import { Button } from '@hey/ui';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useLensAuthData from 'src/hooks/useLensAuthData';

interface JoinProps {
  id: string;
  setJoined: (joined: boolean) => void;
  small: boolean;
}

const Join: FC<JoinProps> = ({ id, setJoined, small }) => {
  const [isLoading, setIsLoading] = useState(false);
  const lensAuthData = useLensAuthData();

  const handleJoin = async () => {
    try {
      setIsLoading(true);
      await axios.post(
        `${HEY_API_URL}/clubs/join`,
        { id },
        { headers: { ...lensAuthData } }
      );

      toast.success('Joined club successfully!');
      setJoined(true);
    } catch (error) {
      errorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      aria-label="Join"
      disabled={isLoading}
      onClick={handleJoin}
      outline
      size={small ? 'sm' : 'md'}
    >
      Join
    </Button>
  );
};

export default Join;
