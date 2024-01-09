import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Card } from '@hey/ui';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
import { usePushChatStore } from 'src/store/persisted/usePushChatStore';

import Attachment from '../Message/Attachment';

const ReplyPreview = () => {
  const replyToMessage = usePushChatStore((state) => state.replyToMessage);
  const setReplyToMessage = usePushChatStore(
    (state) => state.setReplyToMessage
  );
  const recipientProfile = usePushChatStore((state) => state.recipientProfile);

  return replyToMessage ? (
    <div className="flex items-center justify-between p-2">
      <Card className="relative flex w-full flex-row items-center justify-between overflow-hidden p-2">
        <div className="bg-brand-500 absolute left-0 top-0 h-full w-[6px]" />
        <div className="ml-2 flex flex-col justify-center">
          <span className="text-brand-500 font-md text-md">
            {recipientProfile?.localHandle}
          </span>
          <div className="flex items-center">
            <PhotoIcon className="text-brand-500 h-4 w-4" />
            <span className="ml-1">{replyToMessage.messageType}</span>
          </div>
        </div>
        {replyToMessage.messageType === MessageType.TEXT ? (
          <p>{replyToMessage.messageContent}</p>
        ) : (
          <div className="w-[160px]">
            <Attachment message={replyToMessage} />
          </div>
        )}
      </Card>
      <button
        className="ml-2 rounded-full bg-gray-900 p-1.5 opacity-75"
        onClick={() => setReplyToMessage(null)}
        type="button"
      >
        <XMarkIcon className=" h-4 w-4 text-white" />
      </button>
    </div>
  ) : null;
};

export default ReplyPreview;
