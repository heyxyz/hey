import { Input } from '@components/UI/Input';
import { useDebounce } from '@components/utils/hooks/useDebounce';
import { GiphyFetch, ICategory } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import { Grid } from '@giphy/react-components';
import { ChangeEvent, Dispatch, FC, useEffect, useState } from 'react';

const giphyFetch = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh');

interface Props {
  // eslint-disable-next-line no-unused-vars
  setGifAttachment: (gif: IGif) => void;
  setShowModal: Dispatch<boolean>;
}

const GifSelector: FC<Props> = ({ setShowModal, setGifAttachment }) => {
  const [categories, setCategories] = useState<Array<ICategory>>([]);
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
        <Input type="text" placeholder="Search for GIFs" value={debouncedGifInput} onChange={handleSearch} />
      </div>
      <div className="flex overflow-y-auto overflow-x-hidden h-[45vh]">
        {debouncedGifInput ? (
          <Grid
            onGifClick={(item) => onSelectGif(item)}
            fetchGifs={fetchGifs}
            width={498}
            hideAttribution
            columns={3}
            noResultsMessage={<div className="grid place-items-center h-full">No GIFs found.</div>}
            noLink
            key={searchText}
          />
        ) : (
          <div className="grid grid-cols-2 gap-1 w-full">
            {categories.map((category) => (
              <button
                type="button"
                key={category.name_encoded}
                className="flex relative outline-none"
                onClick={() => setDebouncedGifInput(category.name)}
              >
                <img
                  className="object-cover w-full h-32 cursor-pointer"
                  height={128}
                  src={category.gif?.images?.original_still.url}
                  alt=""
                  draggable={false}
                />
                <div className="absolute right-0 bottom-0 py-1 px-2 w-full text-lg font-bold text-right text-white bg-gradient-to-b from-transparent to-gray-800">
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
