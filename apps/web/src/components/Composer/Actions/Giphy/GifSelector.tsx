import { Input } from '@components/UI/Input';
import { useDebounce } from '@components/utils/hooks/useDebounce';
import type { ICategory } from '@giphy/js-fetch-api';
import { GiphyFetch } from '@giphy/js-fetch-api';
import type { IGif } from '@giphy/js-types';
import { Grid } from '@giphy/react-components';
import { t, Trans } from '@lingui/macro';
import type { ChangeEvent, Dispatch, FC } from 'react';
import { useEffect, useState } from 'react';

const giphyFetch = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh');

interface Props {
  setGifAttachment: (gif: IGif) => void;
  setShowModal: Dispatch<boolean>;
}

const GifSelector: FC<Props> = ({ setShowModal, setGifAttachment }) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [debouncedGifInput, setDebouncedGifInput] = useState('');
  const [searchText, setSearchText] = useState('');

  const fetchGiphyCategories = async () => {
    const { data } = await giphyFetch.categories();
    // TODO: we can persist this categories
    setCategories(data);
  };

  const onSelectGif = (item: IGif) => {
    setGifAttachment(item);
    setDebouncedGifInput('');
    setSearchText('');
    setShowModal(false);
  };

  useDebounce(
    () => {
      setSearchText(debouncedGifInput);
    },
    1000,
    [debouncedGifInput]
  );

  useEffect(() => {
    fetchGiphyCategories();
  }, []);

  const fetchGifs = (offset: number) => {
    return giphyFetch.search(searchText, { offset, limit: 10 });
  };

  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    const keyword = evt.target.value;
    setDebouncedGifInput(keyword);
  };

  return (
    <div>
      <div className="m-3">
        <Input
          type="text"
          placeholder={t`Search for GIFs`}
          value={debouncedGifInput}
          onChange={handleSearch}
        />
      </div>
      <div className="flex h-[45vh] overflow-y-auto overflow-x-hidden">
        {debouncedGifInput ? (
          <Grid
            onGifClick={(item) => onSelectGif(item)}
            fetchGifs={fetchGifs}
            width={498}
            hideAttribution
            columns={3}
            noResultsMessage={
              <div className="grid h-full place-items-center">
                <Trans>No GIFs found.</Trans>
              </div>
            }
            noLink
            key={searchText}
          />
        ) : (
          <div className="grid w-full grid-cols-2 gap-1">
            {categories.map((category) => (
              <button
                type="button"
                key={category.name_encoded}
                className="relative flex outline-none"
                onClick={() => setDebouncedGifInput(category.name)}
              >
                <img
                  className="h-32 w-full cursor-pointer object-cover"
                  height={128}
                  src={category.gif?.images?.original_still.url}
                  alt=""
                  draggable={false}
                />
                <div className="absolute right-0 bottom-0 w-full bg-gradient-to-b from-transparent to-gray-800 py-1 px-2 text-right text-lg font-bold text-white">
                  <span className="capitalize">{category.name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GifSelector;
