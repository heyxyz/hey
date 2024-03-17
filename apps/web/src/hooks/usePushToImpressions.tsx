import pushToImpressions from '@lib/pushToImpressions';
import { useEffect } from 'react';

const usePushToImpressions = (id: string): void => {
  useEffect(() => {
    pushToImpressions(id);
  }, [id]);
};

export default usePushToImpressions;
