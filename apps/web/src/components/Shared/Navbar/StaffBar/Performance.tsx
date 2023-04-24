import clsx from 'clsx';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { Badge } from '.';

const Performance: FC = () => {
  const [ttfb, setTtfb] = useState(0);

  // Calculate TTFB
  useEffect(() => {
    new PerformanceObserver((entryList) => {
      const [pageNav] = entryList.getEntriesByType('navigation');
      setTtfb(pageNav.toJSON().responseStart.toFixed(0));
    }).observe({
      type: 'navigation',
      buffered: true
    });
  }, []);

  return (
    <Badge>
      <span
        className={clsx({
          'text-green-700 dark:text-green-400': ttfb < 200,
          'text-yellow-700 dark:text-yellow-400': ttfb >= 200 && ttfb < 400,
          'text-red-700 dark:text-red-400': ttfb >= 400
        })}
      >
        {ttfb}ms <span className="text-[10px]">(TTFB)</span>
      </span>
    </Badge>
  );
};

export default Performance;
