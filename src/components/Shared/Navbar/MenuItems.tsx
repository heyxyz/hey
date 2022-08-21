import { Button } from '@components/UI/Button';
import { Modal } from '@components/UI/Modal';
import { ArrowCircleRightIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { FC, Fragment, useState } from 'react';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { STAFF, USER } from 'src/tracking';
import { useDisconnect } from 'wagmi';

import Login from './Login';
import SignedUser from './SignedUser';
import UnsignedUser from './UnsignedUser';

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
  const profiles = useAppStore((state) => state.profiles);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const isConnected = useAppPersistStore((state) => state.isConnected);
  const isAuthenticated = useAppPersistStore((state) => state.isAuthenticated);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const staffMode = useAppPersistStore((state) => state.staffMode);
  const setStaffMode = useAppPersistStore((state) => state.setStaffMode);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { theme, setTheme } = useTheme();
  const { disconnect } = useDisconnect();

  const toggleStaffMode = () => {
    setStaffMode(!staffMode);
    Mixpanel.track(STAFF.TOGGLE_MODE);
  };

  return isConnected && isAuthenticated && currentProfile ? (
    <SignedUser pingData={pingData} />
  ) : isConnected ? (
    <UnsignedUser />
  ) : (
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
};

export default MenuItems;
