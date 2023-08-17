import { SearchIcon, XIcon } from '@heroicons/react/outline';
import { STATIC_ASSETS_URL } from '@lenster/data/constants';
import { Errors } from '@lenster/data/errors';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import type { Emoji } from '@lenster/types/misc';
import { ErrorMessage, Input } from '@lenster/ui';
import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { clsx } from 'clsx';
import type { ChangeEvent, FC } from 'react';
import { useRef, useState } from 'react';
import { useEffectOnce } from 'usehooks-ts';

import Loader from '../Loader';

interface ListProps {
  setEmoji: (emoji: string) => void;
}

const List: FC<ListProps> = ({ setEmoji }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState('');
  const { isLoading, error, data } = useQuery(['emojisData'], () =>
    axios({
      url: `${STATIC_ASSETS_URL}/emoji.json`
    }).then((res) => res.data)
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  let filteredEmojis = data;
  if (searchText.length > 2) {
    filteredEmojis = data.filter((emoji: any) => {
      return emoji.description.toLowerCase().includes(searchText.toLowerCase());
    });
  }

  useEffectOnce(() => {
    inputRef.current?.focus();
  });

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
    <div>
      <div className="w-full p-2 pb-0 pt-4" data-testid="emoji-search">
        <Input
          onClick={(e) => {
            e.preventDefault();
            stopEventPropagation(e);
          }}
          ref={inputRef}
          autoFocus
          type="text"
          className="px-3 py-2 text-sm"
          placeholder={'Search...'}
          value={searchText}
          iconLeft={<SearchIcon />}
          iconRight={
            <XIcon
              className={clsx(
                'cursor-pointer',
                searchText ? 'visible' : 'invisible'
              )}
              onClick={(e) => {
                e.preventDefault();
                stopEventPropagation(e);
                setSearchText('');
              }}
            />
          }
          onChange={onChange}
        />
      </div>
      <div className="grid max-h-[16rem] grid-cols-7 overflow-y-auto p-2 pt-2 text-lg">
        {filteredEmojis.map((emoji: Emoji) => (
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
    </div>
  );
};

export default List;
