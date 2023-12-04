import type { FC } from 'react';

import cn from '@hey/ui/cn';
import { useState } from 'react';
import { useEffectOnce } from 'usehooks-ts';

import { Badge } from '.';

const Performance: FC = () => {
  const [ttfb, setTtfb] = useState(0);

  // Calculate TTFB
  useEffectOnce(() => {
    new PerformanceObserver((entryList) => {
      const [pageNav] = entryList.getEntriesByType('navigation');
      setTtfb(pageNav.toJSON().responseStart.toFixed(0));
    }).observe({
      buffered: true,
      type: 'navigation'
    });
  });

  return (
    <Badge>
      <span
        className={cn({
          'text-green-700 dark:text-green-400': ttfb < 200,
          'text-red-700 dark:text-red-400': ttfb >= 400,
          'text-yellow-700 dark:text-yellow-400': ttfb >= 200 && ttfb < 400
        })}
      >
        {ttfb}ms <span className="text-[10px]">(TTFB)</span>
      </span>
    </Badge>
  );
};

export default Performance;
