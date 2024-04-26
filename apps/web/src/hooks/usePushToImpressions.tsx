import { useEffect } from 'react';
import pushToImpressions from 'src/helpers/pushToImpressions';

const usePushToImpressions = (id: string): void => {
  useEffect(() => {
    pushToImpressions(id);
  }, [id]);
};

export default usePushToImpressions;
