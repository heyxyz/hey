import { GIPHY_KEY } from '@lenster/data';
import axios from 'axios';
import type { FC } from 'react';
import { useInView } from 'react-cool-inview';
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
        params: { api_key: GIPHY_KEY, q: input, limit: 30, offset }
      });

      return response.data;
    } catch (error) {
      return [];
    }
  };

  const {
    data: gifs,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['gifs', debouncedGifInput],
    queryFn: ({ pageParam = 0 }) => fetchGifs(debouncedGifInput, pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 30) {
        return false;
      }

      return pages.length * 30;
    },
    enabled: !!debouncedGifInput
  });

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasNextPage || isFetchingNextPage) {
        return;
      }

      await fetchNextPage();
    }
  });

  return (
    <div className="w-full overflow-y-auto">
      <div className="grid w-full grid-cols-3 gap-1">
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
                src={gif?.images?.original_still?.url}
                alt={gif.slug}
                draggable={false}
              />
            </button>
          ))
        )}
        {hasNextPage && <span ref={observe} />}
      </div>
    </div>
  );
};

export default Gifs;
