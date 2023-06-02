import { Errors } from '@lenster/data';
import { STATIC_ASSETS_URL } from '@lenster/data/constants';
import { ErrorMessage } from '@lenster/ui';
import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import type { Emoji } from 'src/types';

import Loader from '../Loader';

interface ListProps {
  setEmoji: (emoji: string) => void;
}

const List: FC<ListProps> = ({ setEmoji }) => {
  const { isLoading, error, data } = useQuery(['emojisData'], () =>
    axios({
      url: `${STATIC_ASSETS_URL}/emoji.json`
    }).then((res) => res.data)
  );

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        title={Errors.SomethingWentWrong}
        error={{
          message: 'Error while loading emojis',
          name: Errors.SomethingWentWrong
        }}
      />
    );
  }

  if (isLoading) {
    return <Loader message={t`Loading emojis`} />;
  }

  return (
    <div className="grid max-h-[20rem] grid-cols-7 overflow-y-auto p-5 text-lg">
      {data.map((emoji: Emoji) => (
        <button
          className="rounded-lg py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          key={emoji.emoji}
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
