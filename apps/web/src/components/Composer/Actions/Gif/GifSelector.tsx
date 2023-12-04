import type { IGif } from '@hey/types/giphy';
import type { Dispatch, FC, SetStateAction } from 'react';

import { Input } from '@hey/ui';
import { useState } from 'react';
import { useDebounce } from 'usehooks-ts';

import Categories from './Categories';
import Gifs from './Gifs';

interface GifSelectorProps {
  setGifAttachment: (gif: IGif) => void;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const GifSelector: FC<GifSelectorProps> = ({
  setGifAttachment,
  setShowModal
}) => {
  const [searchText, setSearchText] = useState('');
  const debouncedGifInput = useDebounce<string>(searchText, 500);

  return (
    <>
      <div className="m-3">
        <Input
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search for GIFs"
          type="text"
          value={searchText}
        />
      </div>
      <div className="max-h-[45vh] overflow-y-auto rounded-b-xl">
        {debouncedGifInput ? (
          <Gifs
            debouncedGifInput={debouncedGifInput}
            setGifAttachment={setGifAttachment}
            setSearchText={setSearchText}
            setShowModal={setShowModal}
          />
        ) : (
          <Categories setSearchText={setSearchText} />
        )}
      </div>
    </>
  );
};

export default GifSelector;
