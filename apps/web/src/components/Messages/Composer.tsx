import { Button } from '@components/UI/Button';
import { Input } from '@components/UI/Input';
import { Spinner } from '@components/UI/Spinner';
import useWindowSize from '@components/utils/hooks/useWindowSize';
import { ArrowRightIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import { t, Trans } from '@lingui/macro';
import { MIN_WIDTH_DESKTOP } from 'data/constants';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useMessagePersistStore } from 'src/store/message';
import { MESSAGES } from 'src/tracking';

interface Props {
  sendMessage: (message: string) => Promise<boolean>;
  conversationKey: string;
  disabledInput: boolean;
}

const Composer: FC<Props> = ({ sendMessage, conversationKey, disabledInput }) => {
  const [message, setMessage] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const { width } = useWindowSize();
  const unsentMessage = useMessagePersistStore((state) => state.unsentMessages.get(conversationKey));
  const setUnsentMessage = useMessagePersistStore((state) => state.setUnsentMessage);

  const canSendMessage = !disabledInput && !sending && message.length > 0;

  const handleSend = async () => {
    if (!canSendMessage) {
      return;
    }
    setSending(true);
    const sent = await sendMessage(message);
    if (sent) {
      setMessage('');
      setUnsentMessage(conversationKey, null);
      Analytics.track(MESSAGES.SEND);
    } else {
      toast.error(t`Error sending message`);
    }
    setSending(false);
  };

  useEffect(() => {
    setMessage(unsentMessage ?? '');
  }, [unsentMessage]);

  const onChangeCallback = (value: string) => {
    setUnsentMessage(conversationKey, value);
    setMessage(value);
  };

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex space-x-4 p-4">
      <Input
        type="text"
        placeholder={t`Type Something`}
        value={message}
        disabled={disabledInput}
        onKeyDown={handleKeyDown}
        onChange={(event) => onChangeCallback(event.target.value)}
      />
      <Button disabled={!canSendMessage} onClick={handleSend} variant="primary" aria-label="Send message">
        <div className="flex items-center space-x-2">
          {Number(width) > MIN_WIDTH_DESKTOP ? (
            <span>
              <Trans>Send</Trans>
            </span>
          ) : null}
          {!sending && <ArrowRightIcon className="h-5 w-5" />}
          {sending && <Spinner size="sm" className="h-5 w-5" />}
        </div>
      </Button>
    </div>
  );
};

export default Composer;
