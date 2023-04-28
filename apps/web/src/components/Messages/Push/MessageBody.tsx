import EmojiPicker from 'emoji-picker-react';
import GifPicker from 'gif-picker-react';
import React, { useEffect, useState } from 'react';
import { usePushChatStore } from 'src/store/push-chat';
import { Image, Input } from 'ui';

type GIFType = {
  url: String;
  height: Number;
  width: Number;
};

export default function MessageBody() {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [gifOpen, setGifOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const selectedChatType = usePushChatStore((state) => state.selectedChatType);

  useEffect(() => {
    //fetch chat to show chatbox
    console.log(selectedChatId);
  }, [selectedChatId, selectedChatType]);

  const appendEmoji = ({ emoji }: { emoji: string }) => setInputText(`${inputText}${emoji}`);
  const appendGIF = (emojiObject: GIFType) => {
    console.log({ emojiObject });
  };
  const submitText = () => {
    console.log({ inputText });
  };

  const gifSample = {
    url: 'https://media.tenor.com/YGNEnwUYCf4AAAAC/annoyed-irritated.gif'
  };

  return (
    <section className="h-full	p-5 pb-3">
      <div className="h-[85%] max-h-[85%] overflow-scroll">
        {['yesterday', 'today'].map((date) => (
          <section key={date} className="mb-6 mt-2">
            <p className="mb-4 text-center text-sm text-gray-400">{date}</p>
            <div className="flex flex-col gap-2.5">
              <div className="relative w-fit max-w-[80%] rounded-xl rounded-tl-sm border py-3 pl-4 pr-9 font-medium">
                <p className="text-sm	">Lenster is on 🔥</p>
                <span className="absolute bottom-1.5	right-1.5 text-xs text-gray-500">8:20</span>
              </div>
              <div className="relative w-fit max-w-[80%] rounded-xl rounded-tl-sm border py-3 pl-4 pr-9 font-medium">
                <p className="text-sm	">
                  The Lenster team is doing some really innovative work, I'm excited to see what new features
                  they'll roll out next.
                </p>
                <span className="absolute bottom-1.5	right-1.5 text-xs text-gray-500">8:25</span>
              </div>
              <div className="relative w-fit rounded-xl rounded-tl-sm border">
                <Image
                  className="font-medium0 relative w-fit rounded-xl rounded-tl-sm border"
                  src={gifSample.url}
                  alt=""
                />
                <Image className="absolute right-2.5 top-2.5" src="/push/giticon.svg" alt="" />
              </div>
              <div className="relative w-fit	max-w-[80%] self-end rounded-xl rounded-tr-sm border bg-violet-500 py-3 pl-4 pr-9 font-medium">
                <p className="text-sm	text-white">Group chats, video calls... I wonder what’s next</p>
                <span className="absolute bottom-1.5	right-1.5 text-xs text-white">8:25</span>
              </div>
              <div className="relative self-end overflow-hidden rounded-xl rounded-tr-sm border bg-violet-500">
                <Image
                  className={`relative w-fit self-end rounded-xl rounded-tr-sm border bg-violet-500`}
                  src={gifSample.url}
                  alt=""
                />
                <Image className="absolute right-2.5 top-2.5" src="/push/giticon.svg" alt="" />
              </div>
            </div>
          </section>
        ))}
      </div>
      <div className="relative mt-2">
        <Image
          onClick={() => setEmojiOpen((o) => !o)}
          className="absolute left-2 top-2.5 cursor-pointer"
          src="/push/emoji.svg"
          alt=""
        />
        <div className="absolute right-4 top-2 flex items-center gap-5">
          <Image
            onClick={() => setGifOpen((o) => !o)}
            className="relative cursor-pointer"
            src="/push/gif.svg"
            alt="gif"
          />
          <Image onClick={submitText} className="relative cursor-pointer" src="/push/send.svg" alt="send" />
        </div>
        {emojiOpen ? (
          <div className="absolute bottom-[50px]">
            <EmojiPicker onEmojiClick={appendEmoji} />
          </div>
        ) : (
          ''
        )}
        {gifOpen ? (
          <div className="absolute bottom-[50px] right-0">
            <GifPicker onGifClick={appendGIF} tenorApiKey={String(process.env.NEXT_PUBLIC_GOOGLE_TOKEN)} />
          </div>
        ) : (
          ''
        )}
        <Input
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
          className="pl-11"
          type="text"
          placeholder="Type your message..."
        />
      </div>
    </section>
  );
}
