import { AUTH } from '@hey/data/tracking';
import { Button } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { type FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

interface LoginButtonProps {
  title?: string;
  isBig?: boolean;
}

const LoginButton: FC<LoginButtonProps> = ({
  title = 'Login',
  isBig = false
}) => {
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );

  return (
    <Button
      size={isBig ? 'lg' : 'md'}
      icon={
        <img
          className="mr-0.5 h-3"
          height={12}
          src="/lens.svg"
          alt="Lens Logo"
        />
      }
      onClick={() => {
        setShowAuthModal(true);
        Leafwatch.track(AUTH.LOGIN);
      }}
    >
      {title}
    </Button>
  );
};

export default LoginButton;
