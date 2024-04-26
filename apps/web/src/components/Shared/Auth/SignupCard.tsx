import type { FC } from 'react';

import { APP_NAME, STATIC_IMAGES_URL } from '@hey/data/constants';
import { AUTH } from '@hey/data/tracking';
import { Button, Card } from '@hey/ui';
import { Leafwatch } from 'src/helpers/leafwatch';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

import { useSignupStore } from './Signup';

const SignupCard: FC = () => {
  const { setShowAuthModal } = useGlobalModalStateStore();
  const { setScreen } = useSignupStore();

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
          >
            Signup now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SignupCard;
