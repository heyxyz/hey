import errorToast from '@helpers/errorToast';
import { HEY_API_URL } from '@hey/data/constants';
import { Button } from '@hey/ui';
import axios from 'axios';
import { type FC, useState } from 'react';
import toast from 'react-hot-toast';

interface JoinProps {
  id: string;
}

const Join: FC<JoinProps> = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    try {
      setIsLoading(true);
      await axios.post(`${HEY_API_URL}/clubs/join`, { id });

      toast.success('Joined club successfully!');
    } catch (error) {
      errorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button aria-label="Join" disabled={isLoading} onClick={handleJoin} outline>
      Join
    </Button>
  );
};

export default Join;
