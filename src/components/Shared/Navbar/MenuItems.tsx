import { Button } from '@components/UI/Button';
import { Modal } from '@components/UI/Modal';
import { ArrowCircleRightIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import Link from 'next/link';
import { FC, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { USER } from 'src/tracking';

import Login from './Login';
import SignedUser from './SignedUser';

export const NextLink = ({ href, children, ...rest }: Record<string, any>) => (
  <Link href={href}>
    <a {...rest}>{children}</a>
  </Link>
);

interface Props {
  pingData: {
    ping: string;
  };
}

const MenuItems: FC<Props> = ({ pingData }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (!currentProfile) {
    return (
      <>
        <Modal
          title="Login"
          icon={<ArrowCircleRightIcon className="w-5 h-5 text-brand" />}
          show={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        >
          <Login />
        </Modal>
        <Button
          icon={<img className="mr-0.5 w-4 h-4" height={16} width={16} src="/lens.png" alt="Lens Logo" />}
          onClick={() => {
            setShowLoginModal(!showLoginModal);
            Mixpanel.track(USER.LOGIN);
          }}
        >
          Login
        </Button>
      </>
    );
  }

  return <SignedUser pingData={pingData} />;
};

export default MenuItems;
