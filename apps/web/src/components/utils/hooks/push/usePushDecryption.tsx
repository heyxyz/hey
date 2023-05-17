import { XIcon } from '@heroicons/react/outline';
import type { ProgressHookType, SignerType } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';
import { Image, Spinner } from 'ui';

import useEthersWalletClient from '../useEthersWalletClient';

const totalSteps: number = 2;
enum ProgressType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARN = 'WARN'
}

interface decryptKeyParams {
  encryptedText: string;
  additionalMeta?: { NFTPGP_V1?: { password: string } };
}

type modalInfoType = {
  title: string;
  info: string;
  type: string;
};
const initModalInfo: modalInfoType = {
  title: '',
  info: '',
  type: ''
};

const usePushDecryption = () => {
  const { data: walletClient } = useEthersWalletClient();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowDecryptionModal = usePushChatStore(
    (state) => state.setShowDecryptionModal
  );
  const [step, setStep] = useState<number>(0);
  const [modalClosable, setModalClosable] = useState<boolean>(true);
  const [modalInfo, setModalInfo] = useState<modalInfoType>(initModalInfo);
  const setPgpPrivateKey = usePushChatStore((state) => state.setPgpPrivateKey);

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
            setShowDecryptionModal(false);
          }, timeout);
        }
        setModalClosable(true);
      }
    },
    [setShowDecryptionModal, setModalInfo]
  );

  const reset = useCallback(() => {
    setStep(0);
    setModalInfo(initModalInfo);
    setModalClosable(true);
  }, []);

  const decryptKey = useCallback(
    async ({
      encryptedText,
      additionalMeta = { NFTPGP_V1: { password: '' } }
    }: decryptKeyParams): Promise<{
      decryptedKey?: string | undefined;
      error?: string | undefined;
    }> => {
      reset();
      if (!additionalMeta.NFTPGP_V1?.password) {
        setShowDecryptionModal(true);
      }
      if (!currentProfile || !walletClient) {
        return { decryptedKey: undefined, error: undefined };
      }
      const { ownedBy } = currentProfile;
      try {
        const response = await PushAPI.chat.decryptPGPKey({
          encryptedPGPPrivateKey: encryptedText,
          signer: walletClient as SignerType,
          account: ownedBy,
          additionalMeta: additionalMeta.NFTPGP_V1?.password
            ? additionalMeta
            : undefined,
          progressHook: handleProgress,
          env: PUSH_ENV
        });
        if (!response) {
          return { decryptedKey: undefined, error: undefined };
        }
        setPgpPrivateKey({ decrypted: response });
        return { decryptedKey: response, error: undefined };
      } catch (error: Error | any) {
        console.log(error);
        // handle error here
        return { decryptedKey: undefined, error: error.message };
      }
    },
    [
      currentProfile,
      handleProgress,
      reset,
      setShowDecryptionModal,
      walletClient
    ]
  );

  let modalContent: JSX.Element;
  switch (modalInfo.type) {
    case ProgressType.INFO:
      modalContent = (
        <div className="flex w-full flex-col px-4 py-6">
          <div className="pb-4 text-center text-base font-medium">
            {step}/{totalSteps} - {modalInfo.title}
          </div>
          <div className="pb-4 text-center text-xs font-[450] text-[#818189]">
            {modalInfo.info}
          </div>
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
            <div
              className="bg-brand-500 h-2 rounded-full p-0.5 leading-none"
              style={{ width: `100%` }}
            />
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
            onClick={() => setShowDecryptionModal(false)}
          >
            <XIcon className="h-5 w-5" />
          </button>
          <div className="pb-4 text-center text-base font-medium">
            {modalInfo.title}
          </div>
          <div className="text-center text-xs font-[450] text-[#818189]">
            {modalInfo.info}
          </div>
        </div>
      );
  }

  return { decryptKey, modalContent, isModalClosable: modalClosable };
};

export default usePushDecryption;
