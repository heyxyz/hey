import useXmtpClient from '@components/utils/hooks/useXmtpClient';
import { buildConversationKey } from '@lib/conversationKey';
import conversationMatchesProfile from '@lib/conversationMatchesProfile';
import type { Profile } from 'lens';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

const useListConversations = () => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const conversations = useMessageStore((state) => state.conversations);
  const setConversations = useMessageStore((state) => state.setConversations);
  const messageProfiles = useMessageStore((state) => state.messageProfiles);
  const previewMessages = useMessageStore((state) => state.previewMessages);
  const selectedProfileId = useMessageStore((state) => state.selectedProfileId);
  const setSelectedProfileId = useMessageStore((state) => state.setSelectedProfileId);
  const reset = useMessageStore((state) => state.reset);
  const { client, loading: creatingXmtpClient } = useXmtpClient();
  const [conversationsLoading, setConversationsLoading] = useState<boolean>(true);
  const selectedTab = useMessageStore((state) => state.selectedTab);
  const [profilesToShow, setProfilesToShow] = useState<Map<string, Profile>>(new Map());
  const [requestedCount, setRequestedCount] = useState(0);

  useEffect(() => {
    if (!client || !currentProfile) {
      return;
    }
    const matcherRegex = conversationMatchesProfile(currentProfile.id);

    const listConversations = async () => {
      setConversationsLoading(true);
      const newConversations = new Map(conversations);
      const convos = await client.conversations.list();
      const matchingConvos = convos.filter(
        (convo) => convo.context?.conversationId && matcherRegex.test(convo.context.conversationId)
      );

      for (const convo of matchingConvos) {
        const key = buildConversationKey(convo.peerAddress, convo.context?.conversationId as string);
        newConversations.set(key, convo);
      }

      setConversations(newConversations);
      setConversationsLoading(false);
    };

    listConversations();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, currentProfile?.id, selectedProfileId]);

  useEffect(() => {
    if (selectedProfileId && currentProfile?.id !== selectedProfileId) {
      reset();
      setSelectedProfileId(currentProfile?.id);
      router.push('/messages');
    } else {
      setSelectedProfileId(currentProfile?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  useEffect(() => {
    const partitionedProfiles = Array.from(messageProfiles).reduce(
      (result, [key, profile]) => {
        const message = previewMessages.get(key);
        if (message) {
          if (profile.isFollowedByMe) {
            result[0].set(key, profile);
          } else {
            result[1].set(key, profile);
          }
        }
        return result;
      },
      [new Map<string, Profile>(), new Map<string, Profile>()]
    );
    setProfilesToShow(selectedTab === 'Following' ? partitionedProfiles[0] : partitionedProfiles[1]);
    setRequestedCount(partitionedProfiles[1].size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageProfiles, selectedTab]);

  return {
    authenticating: creatingXmtpClient,
    conversationsLoading,
    profilesToShow,
    requestedCount
  };
};

export default useListConversations;
