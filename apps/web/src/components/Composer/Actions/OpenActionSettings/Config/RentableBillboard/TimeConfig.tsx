import { Input } from '@hey/ui';
import { type FC } from 'react';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokensStore';

import { useRentableBillboardActionStore } from '.';

const TimeConfig: FC = () => {
  const { expiresAt, setExpiresAt, setToken } =
    useRentableBillboardActionStore();
  const { allowedTokens } = useAllowedTokensStore();

  const getFormattedDateTimeLocal = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000; // convert offset to milliseconds
    const localISO = new Date(Number(expiresAt) - offset)
      .toISOString()
      .slice(0, 16);
    return localISO;
  };

  return (
    <div className="mt-5">
      <Input
        label="Expires In"
        max={30}
        min={1}
        onChange={(e) => setExpiresAt(new Date(e.target.value))}
        type="datetime-local"
        value={getFormattedDateTimeLocal()}
      />
    </div>
  );
};

export default TimeConfig;
