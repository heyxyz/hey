import { XIcon } from '@heroicons/react/outline';
import type { ProgressHookType } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
// import { LENSHUB_PROXY } from 'data';
import { useCallback, useState } from 'react';
// import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';
import { Button, Image, Input, Spinner } from 'ui';
import { useSigner } from 'wagmi';

import useCreateChatProfile from './useCreateChatProfile';

type handleSetPassFunc = () => void;
const totalSteps: number = 6;
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
  title: 'Existing Profile Detected',
  info: 'We have detected an existing profile with this account. Enter your existing profile password or start fresh with a new profile.',
  type: ProgressType.INITIATE
};

const useUpgradeChatProfile = () => {
  const { data: signer } = useSigner();
  const { createChatProfile } = useCreateChatProfile();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const setConnectedProfile = usePushChatStore((state) => state.setConnectedProfile);
  const setShowUpgradeChatProfileModal = usePushChatStore((state) => state.setShowUpgradeChatProfileModal);
  const [step, setStep] = useState<number>(1);
  const [modalClosable, setModalClosable] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [modalInfo, setModalInfo] = useState<modalInfoType>(initModalInfo);

  const reset = useCallback(() => {
    setStep(1);
    setModalClosable(true);
    setPassword('');
    setModalInfo(initModalInfo);
  }, []);

  const handleProgress = useCallback(
    (progress: ProgressHookType) => {
      setStep((step) => step + 1);
      setModalInfo({
        title: progress.progressTitle,
        info: progress.progressInfo,
        type: progress.level
      });
      if (progress.level === 'INFO') {
        setModalClosable(false);
      } else {
        if (progress.level === 'SUCCESS') {
          const timeout = 2000; // after this time, modal will be closed
          setTimeout(() => {
            setShowUpgradeChatProfileModal(false);
          }, timeout);
        }
        setModalClosable(true);
      }
    },
    [setModalClosable, setModalInfo, setStep, setShowUpgradeChatProfileModal]
  );

  const initiateProcess = useCallback(() => {
    reset();
  }, [reset]);

  const handleContinue: handleSetPassFunc = useCallback(async () => {
    if (!signer || !currentProfile || !connectedProfile) {
      return;
    }

    try {
      const response = await PushAPI.user.upgrade({
        signer: signer,
        additionalMeta: { password: password },
        account: connectedProfile?.did,
        progressHook: handleProgress,
        env: PUSH_ENV
      });

      if (response) {
        setConnectedProfile(response);
      }
    } catch (error) {
      console.log(error);
      // handle error here
      const timeout = 2000; // after this time, show modal state to 1st step
      setTimeout(() => {
        initiateProcess();
      }, timeout);
    }
  }, [
    signer,
    currentProfile,
    connectedProfile,
    password,
    handleProgress,
    setConnectedProfile,
    initiateProcess
  ]);

  const upgradeChatProfile = useCallback(async () => {
    initiateProcess();
    setShowUpgradeChatProfileModal(true);
  }, [initiateProcess, setShowUpgradeChatProfileModal]);

  let modalContent: JSX.Element;
  switch (modalInfo.type) {
    case ProgressType.INITIATE:
      modalContent = (
        <div className="relative flex w-full flex-col px-4 py-6">
          <div className="pb-1.5 text-center text-base font-medium">
            {step}/{totalSteps} - {modalInfo.title}
          </div>
          <div className="px-5 pb-4 text-center text-xs font-[450] text-[#818189]">{modalInfo.info}</div>
          <div className="px-1 pb-2 text-base font-medium">Enter your password</div>
          <Input
            type="text"
            className="px-4 py-4 text-sm"
            value={password}
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mt-6 text-center text-xs font-[450] text-[#818189]">Forgot your password?</div>
          <div className="pb-2 text-center text-xs font-[450] text-[#818189]">
            Start fresh by creating a new profile
          </div>
          <div
            className="text-brand cursor-pointer self-center text-center text-sm font-[500]"
            onClick={() => {
              createChatProfile();
              reset();
              setShowUpgradeChatProfileModal(false);
            }}
          >
            Create new profile
          </div>
          <Button
            className="mt-6 self-center text-center"
            variant="primary"
            disabled={password === '' ? true : false}
            onClick={handleContinue}
          >
            Continue
          </Button>
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
            {totalSteps}/{totalSteps} - {modalInfo.title}
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
            {modalInfo.info} Redirecting...
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
            onClick={() => setShowUpgradeChatProfileModal(false)}
          >
            <XIcon className="h-5 w-5" />
          </button>
          <div className="pb-4 text-center text-base font-medium">{modalInfo.title}</div>
          <div className="text-center text-xs font-[450] text-[#818189]">{modalInfo.info}</div>
        </div>
      );
  }

  return { upgradeChatProfile, modalContent, isModalClosable: modalClosable };
};

export default useUpgradeChatProfile;
