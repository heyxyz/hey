import type { FC } from 'react';

import { useSignupStore } from '@components/Shared/Auth/Signup';
import { APP_NAME, STATIC_IMAGES_URL } from '@hey/data/constants';
import { AUTH } from '@hey/data/tracking';
import { Button, Card } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

const Signup: FC = () => {
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );
  const setScreen = useSignupStore((state) => state.setScreen);

  return (
    <Card as="aside" className="mb-4 space-y-4 p-5">
      <img
        alt="Dizzy emoji"
        className="mx-auto size-14"
        src={`${STATIC_IMAGES_URL}/emojis/dizzy.png`}
      />
      <div className="space-y-3 text-center">
        <div className="font-bold">Get your {APP_NAME} profile now!</div>
        <div>
          <Button
            onClick={() => {
              setScreen('choose');
              setShowAuthModal(true, 'signup');
              Leafwatch.track(AUTH.OPEN_SIGNUP);
            }}
            size="lg"
            variant="black"
          >
            Signup now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Signup;
