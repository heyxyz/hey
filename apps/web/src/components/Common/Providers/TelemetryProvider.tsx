import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { MIXPANEL_ENABLED, MIXPANEL_TOKEN } from 'data/constants';
import mixpanel from 'mixpanel-browser';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useAppStore } from 'src/store/app';
import { useFingerprintStore } from 'src/store/fingerprint';

if (MIXPANEL_ENABLED) {
  mixpanel.init(MIXPANEL_TOKEN, {
    ignore_dnt: true,
    api_host: '/collect',
    batch_requests: false
  });
}

const TelemetryProvider: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const fingerprint = useFingerprintStore((state) => state.fingerprint);
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

  // Mixpanel identify
  useEffect(() => {
    if (MIXPANEL_ENABLED && currentProfile?.id && fingerprint) {
      mixpanel.identify(currentProfile?.id);
      mixpanel.people.set({
        $name: currentProfile?.handle,
        $fingerprint: fingerprint,
        $last_active: new Date()
      });
      mixpanel.people.set_once({
        $created_at: new Date()
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile?.id]);

  return null;
};

export default TelemetryProvider;
