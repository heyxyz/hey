import Slug from '@components/Shared/Slug';
import UserPreview from '@components/Shared/UserPreview';
import useApproveChatRequest from '@components/utils/hooks/push/useApproveChatRequest';
import useCreateChatProfile from '@components/utils/hooks/push/useCreateChatProfile';
import useFetchChat from '@components/utils/hooks/push/useFetchChat';
import useGetHistoryMessages from '@components/utils/hooks/push/useFetchHistoryMessages';
import useFetchLensProfiles from '@components/utils/hooks/push/useFetchLensProfiles';
import usePushSendMessage from '@components/utils/hooks/push/usePushSendMessage';
import type { GroupDTO, IFeeds, IMessageIPFS } from '@pushprotocol/restapi';
import clsx from 'clsx';
import EmojiPicker from 'emoji-picker-react';
import GifPicker from 'gif-picker-react';
import type { Profile } from 'lens';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { CHAT_TYPES, PUSH_TABS, usePushChatStore } from 'src/store/push-chat';
import { Button, Image, Input, Spinner } from 'ui';

import {
  dateToFromNowDaily,
  getProfileFromDID,
  isProfileExist
} from './helper';
import ModifiedImage from './ModifiedImage';

type GIFType = {
  url: String;
  height: Number;
  width: Number;
};

const GroupType = {
  PUBLIC: 'public',
  PRIVATE: 'private'
};

const CHATS_FETCH_LIMIT = 15;
const MessageCard = ({
  chat,
  position
}: {
  chat: IMessageIPFS;
  position: number;
}) => {
  const time = moment(chat.timestamp).format('hh:mm');
  // position = 0 -> DM (another person), 1 -> Connected Profile ID, 2 -> Group (another person)
  return (
    <div
      className={clsx(
        position === 0
          ? 'rounded-xl rounded-tl-sm dark:bg-[#27272A]'
          : position === 1
          ? 'self-end rounded-xl rounded-tr-sm bg-violet-500'
          : 'absolute top-[-16px] ml-11 rounded-xl rounded-tl-sm dark:bg-[#27272A]',
        'relative w-fit max-w-[80%] border py-3 pl-4 pr-[50px] font-medium dark:border-[#3F3F46]'
      )}
    >
      <p
        className={clsx(
          position === 1 ? 'text-white' : '',
          'max-w-[100%] break-words text-sm'
        )}
      >
        {chat.messageContent}
      </p>
      <span
        className={clsx(
          position === 1 ? 'text-white' : 'text-gray-500 dark:text-[#B1B1B1]',
          'absolute bottom-1.5	right-1.5 text-xs'
        )}
      >
        {time}
      </span>
    </div>
  );
};

const GIFCard = ({
  chat,
  position
}: {
  chat: IMessageIPFS;
  position: number;
}) => {
  // position = 0 -> DM (another person), 1 -> Connected Profile ID, 2 -> Group (another person)
  return (
    <div className={clsx(position ? 'self-end' : '', 'relative w-fit')}>
      <Image
        className={clsx(
          position === 0
            ? 'rounded-xl rounded-tl-sm'
            : position === 1
            ? 'right-0 rounded-xl rounded-tr-sm'
            : 'absolute top-[-16px] ml-11 rounded-xl rounded-tl-sm',
          'font-medium0 relative w-fit border'
        )}
        src={chat.messageContent}
        alt=""
      />
      <Image
        className="absolute right-2.5 top-2.5"
        src="/push/giticon.svg"
        alt=""
      />
    </div>
  );
};

const ImageWithDeprecatedIcon = ModifiedImage(Image);

const SenderProfileInMsg = ({ chat }: { chat: any }) => {
  const { getLensProfile } = useFetchLensProfiles();
  const [profile, setProfile] = useState<Profile>();
  const deprecated = chat?.deprecated ? true : false;

  useEffect(() => {
    (async function () {
      const profileRes = await getLensProfile(getProfileFromDID(chat.fromDID));
      if (profileRes) {
        setProfile(profileRes);
      }
    })();
  }, []);

  return profile ? (
    <div className="flex items-start space-x-2">
      {deprecated ? (
        <ImageWithDeprecatedIcon
          onError={({ currentTarget }) => {
            currentTarget.src = getAvatar(profile, false);
          }}
          src={getAvatar(profile)}
          loading="lazy"
          className="h-9 w-9 rounded-full border bg-gray-200 dark:border-gray-700"
          height={36}
          width={36}
          alt={formatHandle(profile?.handle)}
        />
      ) : (
        <Image
          onError={({ currentTarget }) => {
            currentTarget.src = getAvatar(profile, false);
          }}
          src={getAvatar(profile)}
          loading="lazy"
          className="h-9 w-9 rounded-full border bg-gray-200 dark:border-gray-700"
          height={36}
          width={36}
          alt={formatHandle(profile?.handle)}
        />
      )}
      <UserPreview profile={profile}>
        <p className="bold text-base leading-6">
          {profile.name ?? formatHandle(profile?.handle)}
        </p>
      </UserPreview>
    </div>
  ) : null;
};

const Messages = ({ chat }: { chat: IMessageIPFS }) => {
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const selectedChatType = usePushChatStore((state) => state.selectedChatType);
  let position = chat.fromDID !== connectedProfile?.did ? 0 : 1;

  // making position 2 for groups messages of different people than connected profile
  if (!position && selectedChatType === CHAT_TYPES.GROUP) {
    position = 2;
  }

  if (chat.messageType === 'GIF') {
    return <GIFCard chat={chat} position={position} />;
  }
  return <MessageCard chat={chat} position={position} />;
};

type MessageFieldPropType = {
  scrollToBottom: () => void;
  selectedChat: IFeeds;
  groupType?: (typeof GroupType)[keyof typeof GroupType];
  isMember?: boolean;
};

const requestLimit: number = 30;
const page: number = 1;

const MessageField = ({
  scrollToBottom,
  selectedChat,
  groupType,
  isMember
}: MessageFieldPropType) => {
  const modalRef = useRef(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [gifOpen, setGifOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const { sendMessage, loading: msgSendLoading } = usePushSendMessage();
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const { createChatProfile } = useCreateChatProfile();
  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const { approveChatRequest } = useApproveChatRequest();
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  const requestFeedids = Object.keys(requestsFeed);
  const [toShowJoinPublicGroup, setToShowJoinPublicGroup] =
    useState<boolean>(false);

  const appendEmoji = ({ emoji }: { emoji: string }) =>
    setInputText(`${inputText}${emoji}`);

  const ifGroupRequest = useCallback(() => {
    if (!selectedChat) {
      return false;
    }
    let response = false;
    if (connectedProfile && connectedProfile?.did) {
      selectedChat?.groupInformation?.pendingMembers.map((member) => {
        if (member.wallet === connectedProfile.did) {
          response = true;
          return;
        }
      });
    }
    return response;
  }, [selectedChat, connectedProfile]);

  const sendPushMessage = async (content: string, type: string) => {
    try {
      if (!isProfileExist(connectedProfile)) {
        await createChatProfile();
      }
      if (!decryptedPgpPvtKey) {
        return;
      }
      await sendMessage({
        message: content,
        receiver: selectedChatId,
        messageType: type as any
      });
      scrollToBottom();

      // fetchRequests({ page, requestLimit });
    } catch (error) {
      console.log(error);
    }
  };

  const sendGIF = async (emojiObject: GIFType) => {
    sendPushMessage(emojiObject.url as string, 'GIF');
  };

  const sendTextMsg = async () => {
    await sendPushMessage(inputText, 'Text');
    setInputText('');
  };

  useClickAway(modalRef, () => {
    setGifOpen(false);
    setEmojiOpen(false);
  });

  const handleJoinGroup = async () => {
    try {
      if (!isProfileExist(connectedProfile)) {
        await createChatProfile();
      }
      if (decryptedPgpPvtKey) {
        const response = await approveChatRequest({
          senderAddress: selectedChatId
        });
        setToShowJoinPublicGroup(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (groupType && groupType === GroupType.PUBLIC && !isMember) ||
    toShowJoinPublicGroup ? (
    <div className="flex justify-between rounded-lg border border-solid p-2">
      <div className="align-center self-center text-sm text-[#9E9EA9]">
        You need to join the group in order to send a message
      </div>
      <Button
        onClick={handleJoinGroup}
        className="self-center px-8 py-2 text-center"
        variant="primary"
      >
        Join Group
      </Button>
    </div>
  ) : groupType && groupType === GroupType.PRIVATE && !isMember ? (
    <div className="flex rounded-lg border border-solid py-4">
      <div className="m-auto text-sm text-[#9E9EA9]">
        Invitation request required to join the group.
      </div>
    </div>
  ) : (
    <>
      <Image
        onClick={() => setEmojiOpen((o) => !o)}
        className="absolute left-2 top-2.5 cursor-pointer"
        src="/push/emoji.svg"
        alt=""
      />
      <div className="absolute right-4 top-2 flex items-center gap-5">
        {!msgSendLoading ? (
          <>
            <Image
              onClick={() => setGifOpen((o) => !o)}
              className="relative cursor-pointer"
              src="/push/gif.svg"
              alt="gif"
            />
            <Image
              onClick={sendTextMsg}
              className="relative cursor-pointer"
              src="/push/send.svg"
              alt="send"
            />
          </>
        ) : (
          <div className="relative pt-[3px]">
            <Spinner size="sm" className="mx-auto" />
          </div>
        )}
      </div>
      {emojiOpen && (
        <div ref={modalRef} className="absolute bottom-[50px]">
          <EmojiPicker onEmojiClick={appendEmoji} />
        </div>
      )}
      {gifOpen && (
        <div ref={modalRef} className="absolute bottom-[50px] right-0">
          <GifPicker
            onGifClick={sendGIF}
            tenorApiKey={String(process.env.NEXT_PUBLIC_GOOGLE_TOKEN)}
          />
        </div>
      )}
      <Input
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            sendTextMsg();
          }
        }}
        value={inputText}
        className="pl-11 pr-[115px]"
        type="text"
        disabled={
          msgSendLoading ||
          requestFeedids.includes(selectedChatId) ||
          (selectedChat &&
          connectedProfile &&
          selectedChat.intent &&
          !selectedChat?.intent?.split('+')?.includes(connectedProfile?.did)
            ? true
            : false) ||
          (selectedChat?.groupInformation && ifGroupRequest())
        }
        placeholder="Type your message..."
      />
    </>
  );
};

interface MessageBodyProps {
  groupInfo?: GroupDTO;
  selectedChat: IFeeds;
}

export default function MessageBody({
  groupInfo,
  selectedChat
}: MessageBodyProps) {
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const listInnerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const setActiveTab = usePushChatStore((state) => state.setActiveTab);
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const setRequestsFeed = usePushChatStore((state) => state.setRequestsFeed);
  const setChatfeed = usePushChatStore((state) => state.setChatsFeed);
  const selectedChatType = usePushChatStore((state) => state.selectedChatType);
  const chats = usePushChatStore((state) => state.chats);
  const chatsFeed = usePushChatStore((state) => state.chatsFeed);
  const { getLensProfile } = useFetchLensProfiles();
  const { createChatProfile } = useCreateChatProfile();
  const { fetchChat } = useFetchChat();
  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;
  const dates = new Set();

  const [groupCreatorProfile, setGroupCreatorProfile] = useState<Profile>();
  const [groupDetail, setGroupDetail] = useState<{
    groupType: (typeof GroupType)[keyof typeof GroupType];
    isMember: boolean;
  }>();

  const selectedMessages = chats.get(selectedChatId);
  const prevSelectedId = useRef<string>('');
  const deprecatedChat = selectedChat?.deprecated ? true : false;

  const ifGroupMember = useCallback(() => {
    if (!groupInfo) {
      return false;
    }
    let response = false;
    if (connectedProfile && connectedProfile?.did) {
      groupInfo.members.map((member) => {
        if (member.wallet === connectedProfile.did) {
          response = true;
          return;
        }
      });
      groupInfo.pendingMembers.map((member) => {
        if (member.wallet === connectedProfile.did) {
          response = true;
          return;
        }
      });
    }
    return response;
  }, [groupInfo, connectedProfile]);

  const ifGroupRequest = useCallback(() => {
    if (!groupInfo) {
      return false;
    }
    let response = false;
    if (connectedProfile && connectedProfile?.did) {
      groupInfo.pendingMembers.map((member) => {
        if (member.wallet === connectedProfile.did) {
          response = true;
          return;
        }
      });
    }
    return response;
  }, [groupInfo, connectedProfile]);

  const groupTypeFunc = useCallback(() => {
    if (groupInfo) {
      if (groupInfo.isPublic) {
        return GroupType.PUBLIC;
      } else {
        return GroupType.PRIVATE;
      }
    }
  }, [groupInfo]);

  useEffect(() => {
    if (!groupInfo) {
      return;
    }
    const isMember = ifGroupMember();
    const groupType = groupTypeFunc();
    setGroupDetail({
      groupType: groupType!,
      isMember: isMember
    });
  }, [groupInfo, groupTypeFunc, ifGroupMember]);

  //add loading in jsx
  const { historyMessages, loading } = useGetHistoryMessages();
  const { approveChatRequest, error } = useApproveChatRequest();
  const requestFeedids = Object.keys(requestsFeed);
  const handleApprovechatRequest = async () => {
    if (selectedChatId) {
      try {
        if (!isProfileExist(connectedProfile)) {
          await createChatProfile();
        }
        if (!decryptedPgpPvtKey) {
          return;
        }
        const response = await approveChatRequest({
          senderAddress: selectedChatId
        });
        if (response) {
          const updatedRequestsfeed = { ...requestsFeed };
          const { [selectedChatId]: selectedRequest, ...updatedRequests } =
            updatedRequestsfeed;
          setRequestsFeed(updatedRequests);

          const updatedChatFeed: IFeeds = (await fetchChat({
            recipientAddress: selectedChatId
          })) as IFeeds;

          const chatLe = { ...chatsFeed };
          chatLe[selectedChatId] = updatedChatFeed ?? selectedRequest;
          setChatfeed(chatLe);
          setActiveTab(PUSH_TABS.CHATS);
        }
      } catch (error_: Error | any) {
        console.log(error_.message);
      }
    } else {
      return;
    }
  };

  const getChatCall = async () => {
    if (
      !selectedChat ||
      selectedChatId !== (selectedChat?.did ?? selectedChat?.chatId)
    ) {
      return;
    }
    let threadHash = null;
    const messages = chats.get(selectedChatId);
    if (!messages && selectedChat?.threadhash) {
      threadHash = selectedChat?.threadhash;
    } else if (chats.size && messages?.lastThreadHash) {
      threadHash = messages?.lastThreadHash;
    }
    if (threadHash) {
      await historyMessages({
        threadHash: threadHash,
        chatId: selectedChatId,
        limit: CHATS_FETCH_LIMIT
      });
    }
  };

  const scrollToBottom = (behavior?: string | null) => {
    bottomRef?.current?.scrollIntoView(
      !behavior ? true : { behavior: 'smooth' }
    );
  };

  useEffect(() => {
    if (!groupInfo) {
      return;
    }

    (async function () {
      const groupCreatorProfileId = getProfileFromDID(groupInfo.groupCreator);
      const profile = await getLensProfile(groupCreatorProfileId);
      if (profile) {
        setGroupCreatorProfile(profile);
      }
    })();
  }, [groupInfo]);

  useEffect(() => {
    if (prevSelectedId.current !== selectedChatId) {
      scrollToBottom(null);
    }
    prevSelectedId.current = selectedChatId;
  }, [selectedChatId]);

  useEffect(() => {
    if (
      selectedChatId &&
      selectedMessages &&
      selectedMessages?.messages.length &&
      selectedMessages?.messages.length <= CHATS_FETCH_LIMIT
    ) {
      scrollToBottom(null);
    }
  }, [chats.get(selectedChatId)]);

  const onScroll = async () => {
    if (listInnerRef.current) {
      const { scrollTop } = listInnerRef.current;
      if (scrollTop === 0) {
        let content = listInnerRef.current;
        let curScrollPos = content.scrollTop;
        let oldScroll = content.scrollHeight - content.clientHeight;

        await getChatCall();

        let newScroll = content.scrollHeight - content.clientHeight;
        content.scrollTop = curScrollPos + (newScroll - oldScroll);
      }
    }
  };

  useEffect(() => {
    // only for user who has requests but hasn't created user in push chat yet
    if (selectedMessages?.messages.length) {
      return;
    }

    (async function () {
      if (connectedProfile && !connectedProfile?.encryptedPrivateKey) {
        await getChatCall();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedProfile, selectedChat]);

  useEffect(() => {
    (async function () {
      // only run this hook when there's a decrypted key availabe in storage
      if (!decryptedPgpPvtKey) {
        return;
      }
      await getChatCall();
    })();
  }, [decryptedPgpPvtKey, selectedChat]);

  type RenderDataType = {
    chat: IMessageIPFS;
    dateNum: string;
  };

  const renderDate = ({ chat, dateNum }: RenderDataType) => {
    const timestampDate = dateToFromNowDaily(chat.timestamp as number);
    // Add to Set so it does not render again
    dates.add(dateNum);
    return (
      <p className="py-2 text-center text-xs text-gray-500">{timestampDate}</p>
    );
  };

  return (
    <section className="flex h-[90%] flex-col p-3 pb-3">
      <div
        className="flex-grow overflow-auto px-2"
        ref={listInnerRef}
        onScroll={onScroll}
      >
        {loading ? (
          <div className="flex justify-center py-2">
            <Spinner size="sm" />
          </div>
        ) : (
          ''
        )}

        <div className="flex flex-col gap-2.5">
          {groupDetail?.groupType &&
          groupDetail.groupType === GroupType.PRIVATE &&
          !groupDetail.isMember ? (
            <div className="m-auto mt-8 flex flex-row space-x-2 rounded-md bg-[#F4F4F5] p-2">
              <Image
                alt="deprecated icon"
                src="/push/lock.svg"
                className="h-4 w-4"
              />
              <div className="max-w-[380px] text-center text-sm text-[#9E9EA9]">
                This is a private group. You will only be able to see messages
                once you have been invited to the group.
              </div>
            </div>
          ) : (
            selectedMessages?.messages.map(
              (chat: IMessageIPFS, index: number) => {
                const dateNum = moment(chat.timestamp).format('ddMMyyyy');
                let previousChat = null;
                if (index > 0) {
                  previousChat = selectedMessages?.messages[index - 1]; // Get the previous chat
                }

                return (
                  <>
                    {dates.has(dateNum) ? null : renderDate({ chat, dateNum })}
                    {chat.fromDID !== connectedProfile?.did &&
                    selectedChatType === CHAT_TYPES.GROUP &&
                    (index === 0 || previousChat?.fromDID !== chat.fromDID) ? (
                      <SenderProfileInMsg chat={chat} />
                    ) : null}
                    <Messages chat={chat} key={index} />
                  </>
                );
              }
            )
          )}
          {(requestFeedids.includes(selectedChatId) ||
            (selectedChat &&
              !groupInfo &&
              connectedProfile &&
              selectedChat.intent &&
              !selectedChat?.intent
                ?.split('+')
                ?.includes(connectedProfile?.did)) ||
            (groupInfo && ifGroupRequest())) && (
            <div className="flex w-fit rounded-e rounded-r-2xl rounded-bl-2xl border border-solid border-gray-300 p-2 dark:border-[#3F3F46] dark:bg-[#27272a]">
              {selectedChatType === CHAT_TYPES.CHAT ? (
                <div className="flex flex-col text-sm font-normal">
                  <span>This is your first conversation with the sender.</span>
                  <span>Please accept to continue.</span>
                </div>
              ) : selectedChatType === CHAT_TYPES.GROUP ? (
                <div className="flex flex-col text-sm font-normal">
                  <span>
                    You were invited to the group by{' '}
                    {groupCreatorProfile?.name ??
                      formatHandle(groupCreatorProfile?.handle)}{' '}
                    (
                    <span className="cursor-pointer">
                      {groupCreatorProfile && (
                        <UserPreview profile={groupCreatorProfile}>
                          <Slug
                            className="text-sm"
                            slug={formatHandle(groupCreatorProfile.handle)}
                            prefix="@"
                          />
                        </UserPreview>
                      )}
                    </span>
                    ) .
                  </span>
                  <span>
                    {' '}
                    Please accept to continue messaging in this group.
                  </span>
                </div>
              ) : null}
              <Image
                className="h-12 cursor-pointer"
                onClick={handleApprovechatRequest}
                src="/push/CheckCircle.svg"
                alt="check"
              />
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {deprecatedChat ? (
        <div className="m-auto mb-8 max-w-[350px] text-center text-base text-[#657795]">
          The ownership of this account has changed. Please start a new
          conversation to continue.
        </div>
      ) : (
        <div className="relative mt-2">
          <MessageField
            scrollToBottom={scrollToBottom}
            selectedChat={selectedChat}
            groupType={groupDetail?.groupType}
            isMember={groupDetail?.isMember}
          />
        </div>
      )}
    </section>
  );
}
