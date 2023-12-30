'use client';

import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import getProfileById from '@hey/lib/getProfileById';
import { GridItemEight, GridLayout } from '@hey/ui';
import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
type Props = {};

const Messages = (props: Props) => {
  const [message, setMessage] = useState<string>('');
  const [messagesList, setMessagesList] = useState<(typeof message)[]>([]);

  const {
    isReady,
    query: { handle, id, type }
  } = useRouter();

  if (typeof id === 'string') {
    const profile = id && getProfileById(id);
    console.log({ MESSAGES: profile });
    console.log({ id });
  }

  // TODO: will be replaced with lens protocol profiles
  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() !== '') {
      setMessagesList([...messagesList, message]);
      setMessage('');
    } else if (!message) {
      alert('Cannot send an empty message.');
    }
  };

  const firstSigner = ethers.Wallet.createRandom();
  const secondSigner = ethers.Wallet.createRandom();
  const env = CONSTANTS.ENV.STAGING;

  console.log('First user PVK', firstSigner.privateKey);
  console.log('Second user PVK', secondSigner.privateKey);

  // This was a test to trial out the PushSDK. It was successful.
  // TODO: WILL BE REPLACED WITH LENS PROTOCOL PROFILE INTEGRATION
  const main = async () => {
    console.log('Creating 2 users...');
    // Must initialize connected wallet users
    const firstUser = await PushAPI.initialize(firstSigner, {
      env
    });
    const secondUser = await PushAPI.initialize(secondSigner, {
      env
    });

    console.log('Users created');

    console.log('send messsage from 1st user to 2nd user...');
    await firstUser.chat.send(secondSigner.address, {
      content: 'Hi from first user!',
      type: 'Text'
    });
    console.log('Accepting Request from First user...');
    await secondUser.chat.accept(firstSigner.address);

    console.log('Replying back to first user');
    await secondUser.chat.send(firstSigner.address, {
      content: 'Hey there!!',
      type: 'Text'
    });
    await secondUser.chat.send(firstSigner.address, {
      content: 'Awesome meeting you last night!!',
      type: 'Text'
    });

    console.log('getting chat history');
    const myChats = await firstUser.chat.list('CHATS');
    myChats.map((chat) =>
      console.log(
        `Last message from chat user ${chat.msg.fromCAIP10}: ${chat.msg.messageContent}`
      )
    );

    console.log('creating groupchat..');
    const createdGroup = await firstUser.chat.group.create('My chat', {
      admins: [],
      description: 'This is my groupchat',
      members: [secondSigner.address],
      private: false
    });

    console.log('group created with chatID', createdGroup.chatId);

    console.log('sending messages to group chat');
    await firstUser.chat.send(createdGroup.chatId, {
      content: 'Woooo!',
      type: 'Text'
    });
    await firstUser.chat.send(createdGroup.chatId, {
      content: 'group chat babyyyyy!',
      type: 'Text'
    });
  };

  // main().catch((error) => console.error(error));

  return (
    <div>
      <GridLayout>
        <GridItemEight className="flex gap-4 ">
          <div className=" w-1/4 border-r border-gray-300">
            <h2 className="text-xl font-medium capitalize">Messages</h2>
          </div>
          <div className="w-3/4">
            {/* Header */}
            <div className="text-xl font-medium capitalize shadow-sm">
              <span>Username</span>
            </div>
            {/* container */}
            <div className="flex flex-col justify-between gap-16 shadow-lg">
              {/* chat list */}
              <div className="">
                <h2 className="p-2 text-center">Chat with: Username</h2>
                <ul className="flex flex-col p-3">
                  {messagesList.map((msg, i) => (
                    <motion.li
                      animate={{
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 0.72, scale: 1 },
                        x: 0
                      }}
                      className="bg-brand-300 mt-2 self-end rounded-full rounded-br-none px-5 py-1"
                      initial={{ opacity: 0, scale: 0, x: 50 }}
                      key={i}
                    >
                      {msg}
                    </motion.li>
                  ))}
                </ul>
              </div>
              {/* message box */}
              <form className="flex p-2" onSubmit={sendMessage}>
                <input
                  className=" w-full rounded-lg"
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Start a new message"
                  value={message}
                />
                <div className="justify center bg-brand-100 ml-2 flex items-center rounded-lg p-2">
                  <button type="submit">Send</button>
                  <span>
                    <PaperAirplaneIcon className=" ml-2 w-4" />
                  </span>
                </div>
              </form>
            </div>
          </div>
        </GridItemEight>
      </GridLayout>
    </div>
  );
};

export default Messages;
