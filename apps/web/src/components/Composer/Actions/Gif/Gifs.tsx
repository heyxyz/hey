import { GIPHY_KEY } from '@lenster/data';
import axios from 'axios';
import type { FC } from 'react';
import type { IGif } from 'src/types/giphy';
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
      const response = await axios('https://api.giphy.com/v1/gifs/search', {
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
      <div className="grid w-full w-full grid-cols-3 gap-1 overflow-y-auto">
        {Array.from(Array(12).keys()).map((_, index) => (
          <div
            key={index}
            className="shimmer h-32 w-full cursor-pointer object-cover"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid w-full w-full grid-cols-3 gap-1 overflow-y-auto">
      {gifs?.pages.map((page: any) =>
        page.data.map((gif: IGif) => (
          <button
            type="button"
            key={gif.id}
            className="relative flex outline-none"
            onClick={() => onSelectGif(gif)}
          >
            <img
              className="h-32 w-full cursor-pointer object-cover"
              height={128}
              src={gif?.images?.original?.url}
              alt={gif.slug}
              draggable={false}
            />
          </button>
        ))
      )}
    </div>
  );
};

export default Gifs;
