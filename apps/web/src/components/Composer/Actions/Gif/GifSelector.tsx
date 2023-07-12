import { GIPHY_KEY } from '@lenster/data';
import { Input } from '@lenster/ui';
import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { ChangeEvent, Dispatch, FC } from 'react';
import { useState } from 'react';
import type { IGif } from 'src/types/giphy';
import { useDebounce } from 'usehooks-ts';

import Categories from './Categories';

interface GifSelectorProps {
  setGifAttachment: (gif: IGif) => void;
  setShowModal: Dispatch<boolean>;
}

const GifSelector: FC<GifSelectorProps> = ({
  setShowModal,
  setGifAttachment
}) => {
  const [searchText, setSearchText] = useState('');
  const debouncedGifInput = useDebounce<string>(searchText, 500);

  const fetchGiphyCategories = async () => {
    try {
      const response = await axios('https://api.giphy.com/v1/gifs/categories', {
        params: { api_key: GIPHY_KEY }
      });

      return response.data.data;
    } catch (error) {
      return [];
    }
  };

  const { data: categories } = useQuery(['gifCategories'], () =>
    fetchGiphyCategories().then((res) => res)
  );

  const onSelectGif = (item: IGif) => {
    setGifAttachment(item);
    setSearchText('');
    setShowModal(false);
  };

  const fetchGifs = async (offset: number) => {
    try {
      const response = await axios('https://api.giphy.com/v1/gifs/categories', {
        params: { api_key: GIPHY_KEY, q: debouncedGifInput, limit: 10, offset }
      });

      return response.data.data;
    } catch (error) {
      return [];
    }
  };

  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    const keyword = evt.target.value;
    setSearchText(keyword);
  };

  return (
    <div>
      <div className="m-3">
        <Input
          type="text"
          placeholder={t`Search for GIFs`}
          value={searchText}
          onChange={handleSearch}
        />
      </div>
      <div className="flex h-[45vh] overflow-y-auto overflow-x-hidden">
        {debouncedGifInput ? (
          <div>Soon</div>
        ) : (
          <Categories categories={categories} setSearchText={setSearchText} />
        )}
      </div>
    </div>
  );
};

export default GifSelector;
