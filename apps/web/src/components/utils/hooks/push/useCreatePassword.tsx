import { XIcon } from '@heroicons/react/outline';
import type { ProgressHookType } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { ENCRYPTION_TYPE } from '@pushprotocol/restapi/src/lib/constants';
import { LENSHUB_PROXY } from 'data';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';
import { Button, Image, Input, Spinner } from 'ui';
import { useSigner } from 'wagmi';

import usePushDecryption from './usePushDecryption';

const totalSteps: number = 2;
type handleSetPassFunc = () => void;
enum ProgressType {
  INITIATE = 'INITIATE',
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARN = 'WARN'
}

type modalInfoType = {
  title: string;
  info: string;
  type: string;
};
const initModalInfo: modalInfoType = {
  title: 'Account Password',
  info: 'View or change your password to recover your chats if you transfer your Lens NFT to another wallet.',
  type: 'INITIATE'
};

const useCreatePassword = () => {
  const { data: signer } = useSigner();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const setPasswordStore = usePushChatStore((state) => state.setPassword);
  const { decrypted: decryptedPassword } = usePushChatStore((state) => state.password);
  const setShowCreatePasswordModal = usePushChatStore((state) => state.setShowCreatePasswordModal);
  const [step, setStep] = useState<number>(0);
  const [password, setPassword] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('testtest');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [modalClosable, setModalClosable] = useState<boolean>(true);
  const [modalInfo, setModalInfo] = useState<modalInfoType>(initModalInfo);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { decryptKey } = usePushDecryption();
  const setConnectedProfile = usePushChatStore((state) => state.setConnectedProfile);

  // const setPgpPrivateKey = usePushChatStore((state) => state.setPgpPrivateKey);

  const handleProgress = useCallback(
    (progress: ProgressHookType) => {
      // setStep((step) => step + 1);
      // setModalInfo({
      //   title: progress.progressTitle,
      //   info: progress.progressInfo,
      //   type: progress.level
      // });
      // if (progress.level === 'INFO') {
      //   setModalClosable(false);
      // } else {
      //   if (progress.level === 'SUCCESS') {
      //     const timeout = 2000; // after this time, modal will be closed
      //     setTimeout(() => {
      //       setShowCreatePasswordModal(false);
      //     }, timeout);
      //   }
      //   setModalClosable(true);
      // }
    },
    [setShowCreatePasswordModal, setModalInfo]
  );

  const reset = useCallback(() => {
    setStep(0);
    setModalInfo(initModalInfo);
    setModalClosable(true);
    setOldPassword('testtest');
    setPassword('');
    setModalClosable(true);
    setShowPassword(false);
    setLoading(false);
  }, []);

  const viewAccountPassword = useCallback(async (): Promise<{
    password?: string | undefined;
    error?: string | undefined;
  }> => {
    if (decryptedPassword) {
      setPassword(decryptedPassword);
      setPasswordStore({
        decrypted: decryptedPassword
      });
      setOldPassword(decryptedPassword);
      setShowPassword(true);
      return { password: decryptedPassword, error: undefined };
    } else {
      reset();
    }
    if (!connectedProfile || !signer || !currentProfile) {
      return { password: undefined, error: undefined };
    }
    let keyOne = JSON.parse(connectedProfile?.encryptedPrivateKey);
    let testService = JSON.stringify(keyOne.encryptedPassword);
    try {
      const response = await PushAPI.user.decryptAuth({
        signer: signer,
        account: `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${currentProfile.id}`,
        additionalMeta: {
          NFTPGP_V1: {
            encryptedPassword: testService
          }
        },
        progressHook: handleProgress,
        env: PUSH_ENV
      });
      if (!response) {
        return { password: undefined, error: undefined };
      }
      setPassword(response);
      setPasswordStore({
        decrypted: response
      });
      setOldPassword(response);
      setShowPassword(true);
      return { password: response, error: undefined };
    } catch (error: Error | any) {
      console.log(error);
      // handle error here
      return { password: undefined, error: error.message };
    }
  }, [
    currentProfile,
    handleProgress,
    reset,
    setShowCreatePasswordModal,
    signer,
    connectedProfile,
    decryptedPassword
  ]);

  const initiateProcess = useCallback(() => {
    reset();
  }, [reset]);

  const handleNext: handleSetPassFunc = useCallback(async () => {
    if (!signer || !currentProfile || !connectedProfile) {
      return;
    }

    try {
      const { decryptedKey, error } = await decryptKey({
        encryptedText: connectedProfile?.encryptedPrivateKey,
        additionalMeta: { NFTPGP_V1: { password } }
      });

      if (!decryptedKey) {
        throw new Error(error);
      }

      setLoading(true);
      const response = await PushAPI.user.auth.update({
        pgpPrivateKey: decryptedKey,
        pgpEncryptionVersion: ENCRYPTION_TYPE.NFTPGP_V1,
        signer: signer,
        pgpPublicKey: connectedProfile?.publicKey,
        account: connectedProfile?.did,
        env: PUSH_ENV,
        additionalMeta: {
          NFTPGP_V1: {
            password: oldPassword
          }
        },
        progressHook: handleProgress
      });

      if (response) {
        setConnectedProfile(response);
        setPasswordStore({
          decrypted: oldPassword
        });
        toast.success('Account Password Updated successfully!');
        setShowCreatePasswordModal(false);
      }
    } catch (error: Error | any) {
      console.log(error);
      if (error.message && error.message.includes('OperationError')) {
        setError('Incorrect Password! Please try again!');
      }
      // handle error here
      const timeout = 3000; // after this time, show modal state to 1st step
      setTimeout(() => {
        initiateProcess();
      }, timeout);
    } finally {
      setLoading(false);
    }
  }, [
    signer,
    currentProfile,
    connectedProfile,
    password,
    setConnectedProfile,
    initiateProcess,
    oldPassword,
    decryptedPassword
  ]);

  const createPassword = async () => {
    setShowCreatePasswordModal(true);
    reset();
  };

  let modalContent: JSX.Element;
  switch (modalInfo.type) {
    case ProgressType.INITIATE:
      modalContent = (
        <div className="flex w-full flex-col px-4 py-6">
          <button
            type="button"
            className="absolute right-0 top-0 p-1 pr-4 pt-6 text-[#82828A] focus:outline-none dark:text-gray-100"
            onClick={() => setShowCreatePasswordModal(false)}
          >
            <XIcon className="h-5 w-5" />
          </button>
          <div className="pb-2 text-center text-base font-medium">{modalInfo.title}</div>
          <div className="text-center text-xs font-[450] text-[#818189]">{modalInfo.info}</div>

          <div className="my-4">
            <div className="flex items-center justify-between">
              <div className="pb-2 text-base font-medium">Current Password</div>
            </div>
            <Input
              type={showPassword ? 'text' : 'password'}
              className="px-4 py-4 text-sm"
              value={oldPassword}
              autoComplete="off"
              onChange={(e) => {
                setOldPassword(e.target.value), console.log(e.target.value);
              }}
              iconRight={
                <div
                  onClick={() => viewAccountPassword()}
                  className="cursor-pointer whitespace-nowrap text-xs font-[350] text-[#494D5F]"
                >
                  Tap to view
                </div>
              }
            />
          </div>

          <div className="mt-2 flex flex-row justify-center">
            <Button
              className="mt-4 self-center border-2 text-center"
              variant="primary"
              disabled={!showPassword ? true : false}
              // disabled={isModalInputsEmpty()}
              onClick={() => handleNext()}
            >
              <span className="flex">
                Change Password{' '}
                {loading && <Spinner variant="primary" size="xs" className="ml-2 self-center" />}
              </span>
            </Button>
          </div>
        </div>
      );
      break;
    case ProgressType.INFO:
      modalContent = (
        <div className="flex w-full flex-col px-4 py-6">
          <div className="pb-4 text-center text-base font-medium">
            {step}/{totalSteps} - {modalInfo.title}
          </div>
          <div className="pb-4 text-center text-xs font-[450] text-[#818189]">{modalInfo.info}</div>
          <Spinner variant="primary" size="sm" className="mb-4 self-center" />
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="bg-brand-500 h-2 rounded-full p-0.5 leading-none"
              style={{ width: `${(step * 100) / totalSteps}%` }}
            />
          </div>
        </div>
      );
      break;
    case ProgressType.SUCCESS:
      modalContent = (
        <div className="flex w-full flex-col px-4 py-6">
          <div className="flex items-center justify-center pb-4 text-center text-base font-medium">
            <Image
              src="/checkcircle.png"
              loading="lazy"
              className="mr-2 h-7 w-7 rounded-full"
              alt="Check circle"
            />{' '}
            {step}/{totalSteps} - {modalInfo.title}
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div className="bg-brand-500 h-2 rounded-full p-0.5 leading-none" style={{ width: `100%` }} />
          </div>
        </div>
      );
      break;
    case ProgressType.ERROR:
      modalContent = (
        <div className="flex w-full flex-col px-4 py-6">
          <div className="flex items-center justify-center pb-4 text-center text-sm font-medium text-[#EF4444]">
            <Image
              src="/xcircle.png"
              loading="lazy"
              className="mr-2 h-7 w-7 rounded-full"
              alt="Check circle"
            />{' '}
            {modalInfo.info}
          </div>
        </div>
      );
      break;
    default:
      modalContent = (
        <div className="relative flex w-full flex-col px-4 py-6">
          <button
            type="button"
            className="absolute right-0 top-0 p-1 pr-4 pt-6 text-[#82828A] dark:text-gray-100"
            onClick={() => setShowCreatePasswordModal(false)}
          >
            <XIcon className="h-5 w-5" />
          </button>
          <div className="pb-4 text-center text-base font-medium">{modalInfo.title}</div>
          <div className="text-center text-xs font-[450] text-[#818189]">{modalInfo.info}</div>
        </div>
      );
  }

  return { createPassword, modalContent, isModalClosable: modalClosable };
};

export default useCreatePassword;
