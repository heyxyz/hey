import { useLazyQuery } from '@apollo/client';
import useXmtpClient from '@components/utils/hooks/useXmtpClient';
import type { Profile } from '@generated/types';
import { ProfilesDocument } from '@generated/types';
import buildConversationId from '@lib/buildConversationId';
import chunkArray from '@lib/chunkArray';
import { buildConversationKey, parseConversationKey } from '@lib/conversationKey';
import conversationMatchesProfile from '@lib/conversationMatchesProfile';
import type { Conversation, Stream } from '@xmtp/xmtp-js';
import { SortDirection } from '@xmtp/xmtp-js';
import type { DecodedMessage } from '@xmtp/xmtp-js/dist/types/src/Message';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

const MAX_PROFILES_PER_REQUEST = 50;

const useMessagePreviews = () => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const conversations = useMessageStore((state) => state.conversations);
  const setConversations = useMessageStore((state) => state.setConversations);
  const messageProfiles = useMessageStore((state) => state.messageProfiles);
  const setMessageProfiles = useMessageStore((state) => state.setMessageProfiles);
  const previewMessages = useMessageStore((state) => state.previewMessages);
  const setPreviewMessages = useMessageStore((state) => state.setPreviewMessages);
  const selectedProfileId = useMessageStore((state) => state.selectedProfileId);
  const setSelectedProfileId = useMessageStore((state) => state.setSelectedProfileId);
  const setPreviewMessage = useMessageStore((state) => state.setPreviewMessage);
  const reset = useMessageStore((state) => state.reset);
  const { client, loading: creatingXmtpClient } = useXmtpClient();
  const [profileIds, setProfileIds] = useState<Set<string>>(new Set<string>());
  const [messagesLoading, setMessagesLoading] = useState<boolean>(true);
  const [profilesLoading, setProfilesLoading] = useState<boolean>(false);
  const [profilesError, setProfilesError] = useState<Error | undefined>();
  const [loadProfiles] = useLazyQuery(ProfilesDocument);

  const getProfileFromKey = (key: string): string | null => {
    const parsed = parseConversationKey(key);
    const userProfileId = currentProfile?.id;
    if (!parsed || !userProfileId) {
      return null;
    }

    return parsed.members.find((member) => member !== userProfileId) ?? null;
  };

  useEffect(() => {
    if (profilesLoading) {
      return;
    }
    const toQuery = new Set(profileIds);
    // Don't both querying for already seen profiles
    for (const profile of messageProfiles.values()) {
      toQuery.delete(profile.id);
    }

    if (!toQuery.size) {
      return;
    }

    const loadLatest = async () => {
      setProfilesLoading(true);
      const newMessageProfiles = new Map(messageProfiles);
      const chunks = chunkArray(Array.from(toQuery), MAX_PROFILES_PER_REQUEST);
      try {
        const results = await Promise.all(
          chunks.map((profileIdChunk) =>
            loadProfiles({ variables: { request: { profileIds: profileIdChunk } } })
          )
        );

        for (const result of results) {
          if (!result.data?.profiles.items.length) {
            continue;
          }

          const profiles = result.data.profiles.items as Profile[];
          for (const profile of profiles) {
            const peerAddress = profile.ownedBy as string;
            const key = buildConversationKey(
              peerAddress,
              buildConversationId(currentProfile?.id, profile.id)
            );
            newMessageProfiles.set(key, profile);
          }
        }
      } catch (error: unknown) {
        setProfilesError(error as Error);
      }

      setMessageProfiles(newMessageProfiles);
      setProfilesLoading(false);
    };
    loadLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileIds]);

  useEffect(() => {
    if (!client || !currentProfile) {
      return;
    }
    const matcherRegex = conversationMatchesProfile(currentProfile.id);
    let messageStream: AsyncGenerator<DecodedMessage>;
    let conversationStream: Stream<Conversation>;

    const streamAllMessages = async () => {
      messageStream = await client.conversations.streamAllMessages();

      for await (const message of messageStream) {
        const conversationId = message.conversation.context?.conversationId;
        if (conversationId && matcherRegex.test(conversationId)) {
          const key = buildConversationKey(message.conversation.peerAddress, conversationId);
          setPreviewMessage(key, message);
        }
      }
    };

    const fetchMostRecentMessage = async (
      convo: Conversation
    ): Promise<{ key: string; message?: DecodedMessage }> => {
      const key = buildConversationKey(convo.peerAddress, convo.context?.conversationId as string);

      const newMessages = await convo.messages({
        limit: 1,
        direction: SortDirection.SORT_DIRECTION_DESCENDING
      });
      if (newMessages.length <= 0) {
        return { key };
      }
      return { key, message: newMessages[0] };
    };

    const listConversations = async () => {
      setMessagesLoading(true);
      const newPreviewMessages = new Map(previewMessages);
      const newConversations = new Map(conversations);
      const newProfileIds = new Set(profileIds);
      const convos = await client.conversations.list();
      const matchingConvos = convos.filter(
        (convo) => convo.context?.conversationId && matcherRegex.test(convo.context.conversationId)
      );

      for (const convo of matchingConvos) {
        const key = buildConversationKey(convo.peerAddress, convo.context?.conversationId as string);
        newConversations.set(key, convo);
      }

      const previews = await Promise.all(matchingConvos.map(fetchMostRecentMessage));

      for (const preview of previews) {
        const profileId = getProfileFromKey(preview.key);
        if (profileId) {
          newProfileIds.add(profileId);
        }
        if (preview.message) {
          newPreviewMessages.set(preview.key, preview.message);
        }
      }
      setPreviewMessages(newPreviewMessages);
      setConversations(newConversations);
      setMessagesLoading(false);
      if (newProfileIds.size > profileIds.size) {
        setProfileIds(newProfileIds);
      }
    };

    const closeConversationStream = async () => {
      if (!conversationStream) {
        return;
      }
      await conversationStream.return();
    };

    const closeMessageStream = async () => {
      if (messageStream) {
        await messageStream.return(undefined); // eslint-disable-line unicorn/no-useless-undefined
      }
    };

    const streamConversations = async () => {
      closeConversationStream();
      conversationStream = (await client?.conversations?.stream()) || [];
      const matcherRegex = conversationMatchesProfile(currentProfile?.id);
      for await (const convo of conversationStream) {
        // Ignore any new conversations not matching the current profile
        if (!convo.context?.conversationId || !matcherRegex.test(convo.context.conversationId)) {
          continue;
        }
        const newConversations = new Map(conversations);
        const newProfileIds = new Set(profileIds);
        const key = buildConversationKey(convo.peerAddress, convo.context.conversationId);
        newConversations.set(key, convo);
        const profileId = getProfileFromKey(key);
        if (profileId && !profileIds.has(profileId)) {
          newProfileIds.add(profileId);
          setProfileIds(newProfileIds);
        }
        setConversations(newConversations);
      }
    };

    listConversations();
    streamConversations();
    streamAllMessages();

    return () => {
      closeConversationStream();
      closeMessageStream();
    };
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

  return {
    authenticating: creatingXmtpClient,
    loading: messagesLoading || profilesLoading,
    messages: previewMessages,
    profiles: messageProfiles,
    profilesError: profilesError
  };
};

export default useMessagePreviews;
