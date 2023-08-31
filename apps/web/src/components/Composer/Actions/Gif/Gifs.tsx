import { GIPHY_KEY } from '@lenster/data/constants';
import type { IGif } from '@lenster/types/giphy';
import axios from 'axios';
import { For } from 'million/react';
import type { FC } from 'react';
import { useInfiniteQuery } from 'wagmi';

interface CategoriesProps {
  debouncedGifInput: string;
  setGifAttachment: (gif: IGif) => void;
  setSearchText: (searchText: string) => void;
  setShowModal: (showModal: boolean) => void;
}

const Gifs: FC<CategoriesProps> = ({
  debouncedGifInput,
  setGifAttachment,
  setSearchText,
  setShowModal
}) => {
  const onSelectGif = (item: IGif) => {
    setGifAttachment(item);
    setSearchText('');
    setShowModal(false);
  };

  const fetchGifs = async (input: string, offset: number) => {
    try {
      const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
        params: { api_key: GIPHY_KEY, q: input, limit: 48, offset }
      });

      return response.data;
    } catch (error) {
      return [];
    }
  };

  const { data: gifs, isFetching } = useInfiniteQuery({
    queryKey: ['gifs', debouncedGifInput],
    queryFn: ({ pageParam = 0 }) => fetchGifs(debouncedGifInput, pageParam),
    enabled: !!debouncedGifInput
  });

  if (isFetching) {
    return (
      <div className="grid w-full grid-cols-3 gap-1 overflow-y-auto">
        <For each={Array.from(Array(12).keys())}>
          {(_, index) => (
            <div
              key={index}
              className="shimmer h-32 w-full cursor-pointer object-cover"
            />
          )}
        </For>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-3 gap-1 overflow-y-auto">
      {gifs?.pages ? (
        <For each={gifs?.pages}>
          {(page: any) => (
            <For each={page.data}>
              {(gif: IGif) => (
                <button
                  key={gif.id}
                  type="button"
                  onClick={() => onSelectGif(gif)}
                  className="relative flex outline-none"
                >
                  <img
                    height={128}
                    alt={gif.slug}
                    draggable={false}
                    src={gif?.images?.original?.url}
                    className="h-32 w-full cursor-pointer object-cover"
                  />
                </button>
              )}
            </For>
          )}
        </For>
      ) : null}
    </div>
  );
};

export default Gifs;
