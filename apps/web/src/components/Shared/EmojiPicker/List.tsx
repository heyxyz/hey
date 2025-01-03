import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { STATIC_ASSETS_URL } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { Emoji } from "@hey/types/misc";
import { ErrorMessage, Input } from "@hey/ui";
import cn from "@hey/ui/cn";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { ChangeEvent, FC } from "react";
import { useEffect, useRef, useState } from "react";
import { GET_EMOJIS_QUERY_KEY } from "src/hooks/prosekit/useEmojiQuery";
import Loader from "../Loader";

interface ListProps {
  setEmoji: (emoji: string) => void;
}

const List: FC<ListProps> = ({ setEmoji }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState("");
  const { data, error, isLoading } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(`${STATIC_ASSETS_URL}/emoji.json`);
      return data;
    },
    queryKey: [GET_EMOJIS_QUERY_KEY]
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  let filteredEmojis = data;
  if (searchText.length > 2) {
    filteredEmojis = data.filter((emoji: any) => {
      return emoji.description.toLowerCase().includes(searchText.toLowerCase());
    });
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={{
          message: "Error while loading emojis",
          name: Errors.SomethingWentWrong
        }}
        title={Errors.SomethingWentWrong}
      />
    );
  }

  if (isLoading) {
    return <Loader className="my-5" message="Loading emojis" />;
  }

  return (
    <div>
      <div className="w-full p-2 pt-4 pb-0">
        <Input
          autoFocus
          className="px-3 py-2 text-sm"
          iconLeft={<MagnifyingGlassIcon />}
          iconRight={
            <XMarkIcon
              className={cn(
                "cursor-pointer",
                searchText ? "visible" : "invisible"
              )}
              onClick={(e) => {
                e.preventDefault();
                stopEventPropagation(e);
                setSearchText("");
              }}
            />
          }
          onChange={onChange}
          onClick={(e) => {
            e.preventDefault();
            stopEventPropagation(e);
          }}
          placeholder="Search..."
          ref={inputRef}
          type="text"
          value={searchText}
        />
      </div>
      <div className="grid max-h-[10rem] grid-cols-8 overflow-y-auto p-2 pt-2">
        {filteredEmojis.map((emoji: Emoji) => (
          <button
            className="rounded-lg py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
            key={emoji.emoji}
            onClick={() => setEmoji(emoji.emoji)}
            type="button"
          >
            {emoji.emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default List;
