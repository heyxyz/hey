import { Button } from '@components/UI/Button';
import { Input } from '@components/UI/Input';
import { Spinner } from '@components/UI/Spinner';
import useWindowSize from '@components/utils/hooks/useWindowSize';
import { ArrowRightIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import { t, Trans } from '@lingui/macro';
import { LS_KEYS, MIN_WIDTH_DESKTOP } from 'data/constants';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
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

  const canSendMessage = !disabledInput && !sending && message.length > 0;

  const getPartialMessageStore = (): any => {
    const jsonData = localStorage.getItem(LS_KEYS.PARTIAL_MESSAGE_STORE);
    return jsonData ? JSON.parse(jsonData) : {};
  };

  const setPartialMessageStore = (store: any) => {
    const jsonData = JSON.stringify(store);
    localStorage.setItem(LS_KEYS.PARTIAL_MESSAGE_STORE, jsonData);
  };

  const handleSend = async () => {
    if (!canSendMessage) {
      return;
    }
    setSending(true);
    const sent = await sendMessage(message);
    if (sent) {
      setMessage('');
      const store = getPartialMessageStore();
      delete store[conversationKey];
      setPartialMessageStore(store);
      Analytics.track(MESSAGES.SEND);
    } else {
      toast.error(t`Error sending message`);
    }
    setSending(false);
  };

  useEffect(() => {
    const store = getPartialMessageStore();
    const partialMessage = store[conversationKey];
    setMessage(partialMessage ?? '');
  }, [conversationKey]);

  const onChangeCallback = (value: string) => {
    const store = getPartialMessageStore();
    store[conversationKey] = value;
    setPartialMessageStore(store);
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
