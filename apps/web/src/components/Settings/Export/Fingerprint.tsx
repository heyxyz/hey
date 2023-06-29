import { Card } from '@lenster/ui';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useFingerprintStore } from 'src/store/fingerprint';

const Fingerprint: FC = () => {
  const fingerprint = useFingerprintStore((state) => state.fingerprint);

  if (!fingerprint) {
    return null;
  }

  return (
    <Card className="space-y-2 p-5">
      <div className="pb-1 text-lg font-bold">
        <Trans>Your unique fingerprint</Trans>
      </div>
      <span className="rounded-md bg-gray-300 px-1.5 py-0.5 text-sm font-bold dark:bg-gray-600">
        {fingerprint}
      </span>
    </Card>
  );
};

export default Fingerprint;
