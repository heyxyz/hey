import { ErrorMessage } from '@components/UI/ErrorMessage';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { ERROR_MESSAGE, STATIC_ASSETS_URL } from 'src/constants';

import Loader from '../Loader';

interface Props {
  setEmoji: (emoji: string) => void;
}

const List: FC<Props> = ({ setEmoji }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [emojis, setEmojis] = useState([]);

  const getEmojisList = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${STATIC_ASSETS_URL}/emoji.json`);
      const data = await res.json();
      setLoading(false);
      setEmojis(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmojisList();
  }, []);

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        title={ERROR_MESSAGE}
        error={{ message: 'Error while loading emojis', name: ERROR_MESSAGE }}
      />
    );
  }

  if (loading) {
    return <Loader message="Loading emojis" />;
  }

  return (
    <div className="max-h-[20rem] overflow-y-auto p-5 grid grid-cols-7 text-lg">
      {emojis.map((emoji: any, index) => (
        <button
          className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg py-1"
          key={index}
          type="button"
          onClick={() => setEmoji(emoji.emoji)}
        >
          {emoji.emoji}
        </button>
      ))}
    </div>
  );
};

export default List;
