import ChatView from '@components/messages/ChatView';
import Loader from '@components/Shared/Loader';
import { PUSH_ENV } from '@hey/data/constants';
import { PushAPI } from '@pushprotocol/restapi';
import { useState } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useUpdateEffect } from 'usehooks-ts';
import { useWalletClient } from 'wagmi';

const ChatPage = () => {
  const { data: signer, isLoading } = useWalletClient();

  const currentProfile = useProfileStore((state) => state.currentProfile);

  const [api, setApi] = useState<PushAPI>();

  useUpdateEffect(() => {
    if (!signer || !currentProfile) {
      return;
    }
    // Make use of zustand to store the client instead of doing it every component render
    const initialize = async () => {
      const _user = await PushAPI.initialize(signer, { env: PUSH_ENV });
      // Syncs name between push & lens
      const _userProfile = await _user.info();
      if (!_userProfile.profile.name) {
        await _user.profile.update({ name: currentProfile.handle?.localName });
      }
      setApi(_user);
    };
    initialize();
  }, [signer]);

  if (!api || isLoading) {
    return (
      <div className="page-center flex-col">
        <Loader message="Connecting..." />
      </div>
    );
  }

  return api && <ChatView user={api} />;
};

export default ChatPage;
