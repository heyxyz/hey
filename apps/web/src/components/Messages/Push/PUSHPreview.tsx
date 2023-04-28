import Search from '@components/Messages/Push/Search';
import useCreateChatProfile from '@components/utils/hooks/push/useCreateChatProfile';
import useGetChatProfile from '@components/utils/hooks/push/useGetChatProfile';
import usePushDecryption from '@components/utils/hooks/push/usePushDecryption';
import useUpgradeChatProfile from '@components/utils/hooks/push/useUpgradeChatProfile';
import { Trans } from '@lingui/macro';
import { type FC, useCallback, useEffect } from 'react';
import { PUSH_TABS, usePushChatStore } from 'src/store/push-chat';
import { Card, Modal } from 'ui';
import * as wagmi from 'wagmi';

interface PreviewListProps {
  selectedConversationKey?: string;
}
const activeIndex = 1;

const PUSHPreview: FC<PreviewListProps> = () => {
  const { data: signer } = wagmi.useSigner();
  const { fetchChatProfile } = useGetChatProfile();
  const activeTab = usePushChatStore((state) => state.activeTab);
  const setActiveTab = usePushChatStore((state) => state.setActiveTab);
  const setPgpPrivateKey = usePushChatStore((state) => state.setPgpPrivateKey);
  const showCreateChatProfileModal = usePushChatStore((state) => state.showCreateChatProfileModal);
  const setShowCreateChatProfileModal = usePushChatStore((state) => state.setShowCreateChatProfileModal);
  const showUpgradeChatProfileModal = usePushChatStore((state) => state.showUpgradeChatProfileModal);
  const showDecryptionModal = usePushChatStore((state) => state.showDecryptionModal);
  const setShowUpgradeChatProfileModal = usePushChatStore((state) => state.setShowUpgradeChatProfileModal);
  const setShowDecryptionModal = usePushChatStore((state) => state.setShowDecryptionModal);
  const {
    createChatProfile,
    modalContent: createChatProfileModalContent,
    isModalClosable: isCreateChatProfileModalClosable
  } = useCreateChatProfile();
  const {
    upgradeChatProfile,
    modalContent: upgradeChatProfileModalContent,
    isModalClosable: isUpgradeChatProfileModalClosable
  } = useUpgradeChatProfile();
  const {
    decryptKey,
    modalContent: decryptionModalContent,
    isModalClosable: isDecryptionModalClosable
  } = usePushDecryption();

  const decryptAndUpgrade = useCallback(
    async (encryptedPvtKey: string) => {
      const { decryptedKey, error } = await decryptKey({ encryptedText: encryptedPvtKey });
      if (decryptedKey) {
        setPgpPrivateKey({ decrypted: decryptedKey });
      } else if (typeof error === 'string' && error?.includes('OperationError')) {
        setShowDecryptionModal(false);
        await upgradeChatProfile();
        // eslint-disable-next-line no-use-before-define
        // connectProfile();
      } else {
        console.log(error);
        const time = 3000;
        setTimeout(() => {
          decryptAndUpgrade(encryptedPvtKey);
        }, time);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [decryptKey, setPgpPrivateKey, setShowDecryptionModal, upgradeChatProfile]
  );

  const connectProfile = useCallback(async () => {
    const connectedProfile = await fetchChatProfile();
    if (connectedProfile && connectedProfile.encryptedPrivateKey) {
      setPgpPrivateKey({ encrypted: connectedProfile.encryptedPrivateKey });
      const encryptedPvtKey = connectedProfile.encryptedPrivateKey;
      decryptAndUpgrade(encryptedPvtKey);
    }
  }, [decryptAndUpgrade, fetchChatProfile, setPgpPrivateKey]);

  useEffect(() => {
    if (!signer) {
      return;
    }
    connectProfile();
  }, [connectProfile, signer]);

  return (
    <div className="flex h-full flex-col justify-between">
      <Card className="flex h-full flex-col p-4 pt-7">
        {/* section for header */}
        <section className="mb-4">
          <div className="mb-6 flex gap-x-5 border-b border-b-gray-300">
            <div
              onClick={() => setActiveTab(PUSH_TABS.CHATS)}
              className={`w-6/12 cursor-pointer border-b-4 pb-3.5 text-center  font-bold ${
                activeTab === PUSH_TABS.CHATS ? 'border-b-brand-500' : 'border-b-transparent text-gray-500'
              }`}
            >
              <Trans>Chats</Trans>
            </div>
            <div
              onClick={() => setActiveTab(PUSH_TABS.REQUESTS)}
              className={`align-items-center flex w-6/12 cursor-pointer justify-center gap-x-1.5 border-b-4 pb-3.5 font-bold ${
                activeTab === PUSH_TABS.REQUESTS ? 'border-b-brand-500' : 'border-b-transparent text-gray-500'
              }`}
            >
              <Trans>Requests</Trans>
              <div className=" bg-brand-500 flex h-5 w-7 justify-center rounded-full text-sm text-white">
                2
              </div>
            </div>
          </div>

          <div className="flex gap-x-2">
            <Search placeholder="Search name.eth or 0x123..." modalWidthClassName="w-80" />
            <div className="">
              <img className="h-10 w-11" src="/push/requestchat.svg" alt="plus icon" />
            </div>
          </div>
        </section>
        {/* section for header */}
        {/* section for chats */}
        {activeTab === PUSH_TABS.CHATS && (
          <section className="flex flex-col	gap-2.5	">
            {[1, 2].map((number) => (
              <div
                key={number}
                className={`flex h-16 cursor-pointer gap-2.5 rounded-lg  p-2.5 pr-3 transition-all hover:bg-gray-100 ${
                  activeIndex === number && 'bg-brand-100'
                }`}
              >
                <img className="h-12	w-12 rounded-full" src="/user.svg" alt="" />
                <div className="flex w-full	justify-between	">
                  <div>
                    <p className="bold text-base">Sasi</p>
                    <p className="text-sm text-gray-500	">GMGM!!</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">a minute ago</span>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
        {/* section for chats */}
        {/* sections for requests */}
        {activeTab === PUSH_TABS.REQUESTS && <section>requests</section>}
        {/* sections for requests */}
      </Card>
      <button onClick={createChatProfile}>Create Profile</button>
      <button onClick={upgradeChatProfile}>Upgrade Profile</button>
      <Modal
        size="xs"
        show={showCreateChatProfileModal}
        onClose={isCreateChatProfileModalClosable ? () => setShowCreateChatProfileModal(false) : () => {}}
      >
        {createChatProfileModalContent}
      </Modal>
      <Modal
        size="xs"
        show={showUpgradeChatProfileModal}
        onClose={isUpgradeChatProfileModalClosable ? () => setShowUpgradeChatProfileModal(false) : () => {}}
      >
        {upgradeChatProfileModalContent}
      </Modal>
      <Modal
        size="xs"
        show={showDecryptionModal}
        onClose={isDecryptionModalClosable ? () => setShowDecryptionModal(false) : () => {}}
      >
        {decryptionModalContent}
      </Modal>
    </div>
  );
};

export default PUSHPreview;
