import errorToast from '@helpers/errorToast';
import getAuthApiHeaders from '@helpers/getAuthApiHeaders';
import { HEY_API_URL } from '@hey/data/constants';
import { Button } from '@hey/ui';
import axios from 'axios';
import { type FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface JoinProps {
  id: string;
  isMember: boolean;
}

const Join: FC<JoinProps> = ({ id, isMember }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [joined, setJoined] = useState(isMember);

  useEffect(() => {
    setJoined(isMember);
  }, [isMember]);

  const handleJoin = async () => {
    try {
      setIsLoading(true);
      await axios.post(
        `${HEY_API_URL}/clubs/join`,
        { id },
        { headers: getAuthApiHeaders() }
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
      disabled={isLoading || joined}
      onClick={handleJoin}
      outline
    >
      {joined ? 'Joined' : 'Join'}
    </Button>
  );
};

export default Join;
