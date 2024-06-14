import type { FC } from 'react';

import { AUTH } from '@good/data/tracking';
import { Button } from '@good/ui';
import cn from '@good/ui/cn';
import { Leafwatch } from '@helpers/leafwatch';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

interface LoginButtonProps {
  className?: string;
  isBig?: boolean;
  isFullWidth?: boolean;
  title?: string;
}

const LoginButton: FC<LoginButtonProps> = ({
  className = '',
  isBig = false,
  isFullWidth = false,
  title = 'Login'
}) => {
  const { setShowAuthModal } = useGlobalModalStateStore();

  return (
    <Button
      className={cn(
        isFullWidth ? 'flex w-full items-center justify-center' : className
      )}
      onClick={(e) => {
        e.stopPropagation();
        setShowAuthModal(true);
        Leafwatch.track(AUTH.OPEN_LOGIN);
      }}
      size={isBig ? 'lg' : 'md'}
    >
      {title}
    </Button>
  );
};

export default LoginButton;
