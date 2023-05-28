import FingerprintJS from '@fingerprintjs/fingerprintjs';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useFingerprintStore } from 'src/store/fingerprint';

const TelemetryProvider: FC = () => {
  const setFingerprint = useFingerprintStore((state) => state.setFingerprint);

  const saveFingerprint = async () => {
    const fp = await FingerprintJS.load();
    const { visitorId } = await fp.get();
    setFingerprint(visitorId);
  };

  useEffect(() => {
    saveFingerprint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

export default TelemetryProvider;
