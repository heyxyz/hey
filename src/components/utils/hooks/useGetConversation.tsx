import type { Profile } from '@generated/types';
import { parseConversationKey } from '@lib/conversationKey';
import { Client } from '@xmtp/xmtp-js';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

const useGetConversation = (conversationKey: string, profile?: Profile) => {
  const client = useMessageStore((state) => state.client);
  const conversations = useMessageStore((state) => state.conversations);
  const setConversations = useMessageStore((state) => state.setConversations);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [missingXmtpAuth, setMissingXmtpAuth] = useState<boolean>();

  const reset = () => {
    setConversations(new Map());
    setMissingXmtpAuth(false);
  };

  useEffect(() => {
    if (!profile || !client) {
      return;
    }
    const conversation = conversations.get(conversationKey);
    if (conversation) {
      setMissingXmtpAuth(false);
      return;
    }
    const createNewConversation = async () => {
      const conversationId = parseConversationKey(conversationKey)?.conversationId;
      const canMessage = await Client.canMessage(profile.ownedBy);
      setMissingXmtpAuth(!canMessage);

      if (!canMessage || !conversationId) {
        return;
      }
      const conversation = await client.conversations.newConversation(profile.ownedBy, {
        conversationId: conversationId,
        metadata: {}
      });
      conversations.set(conversationKey, conversation);
      setConversations(new Map(conversations));
    };
    createNewConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  useEffect(() => {
    if (!currentProfile) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  return {
    selectedConversation: conversations.get(conversationKey),
    missingXmtpAuth
  };
};

export default useGetConversation;
