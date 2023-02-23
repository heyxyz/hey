import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { ClockIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useCollectModuleStore } from 'src/store/collect-module';
import { PUBLICATION } from 'src/tracking';

const TimeLimitConfig: FC = () => {
  const hasTimeLimit = useCollectModuleStore((state) => state.hasTimeLimit);
  const setHasTimeLimit = useCollectModuleStore((state) => state.setHasTimeLimit);

  return (
    <div className="pt-5">
      <ToggleWithHelper
        on={hasTimeLimit}
        setOn={() => {
          setHasTimeLimit(!hasTimeLimit);
          Mixpanel.track(PUBLICATION.NEW.COLLECT_MODULE.TOGGLE_TIME_LIMIT_COLLECT);
        }}
        heading={t`Time limit`}
        description={t`Limit collecting to the first 24h`}
        icon={<ClockIcon className="h-4 w-4" />}
      />
    </div>
  );
};

export default TimeLimitConfig;
