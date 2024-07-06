import { HEY_API_URL } from '@hey/data/constants';
import axios from 'axios';

const pushWebVitalsToLeafwatch = async (metric: {
  id: string;
  name: string;
  value: number;
}): Promise<boolean> => {
  if (location.host !== 'hey.xyz') {
    return false;
  }

  try {
    const response = await axios.post(`${HEY_API_URL}/leafwatch/vitals`, {
      delta: metric.value,
      id: metric.id,
      name: metric.name
    });

    return response.data.success;
  } catch {
    return false;
  }
};

export default pushWebVitalsToLeafwatch;
