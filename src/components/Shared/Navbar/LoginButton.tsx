import { Button } from '@components/UI/Button';
import { Modal } from '@components/UI/Modal';
import { ArrowCircleRightIcon } from '@heroicons/react/outline';
import type { FC } from 'react';
import { useState } from 'react';

import Login from './Login';

const LoginButton: FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

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
        onClick={() => setShowLoginModal(!showLoginModal)}
      >
        Login
      </Button>
    </>
  );
};

export default LoginButton;
