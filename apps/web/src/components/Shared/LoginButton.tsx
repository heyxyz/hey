import type { FC } from 'react';

import { Leafwatch } from '@helpers/leafwatch';
import { AUTH } from '@hey/data/tracking';
import { Button } from '@hey/ui';
import cn from '@hey/ui/cn';
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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowAuthModal(true);
    Leafwatch.track(AUTH.OPEN_LOGIN);
  };

  return (
    <Button
      className={cn(
        isFullWidth ? 'flex w-full items-center justify-center' : '',
        className
      )}
      icon={
        <img
          alt="Lens Logo"
          className="mr-0.5 h-3"
          height={12}
          src="/lens.svg"
          width={19}
        />
      }
      onClick={handleClick}
      size={isBig ? 'lg' : 'md'}
    >
      {title}
    </Button>
  );
};

export default LoginButton;
