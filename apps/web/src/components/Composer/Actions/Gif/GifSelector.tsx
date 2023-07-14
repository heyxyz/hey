import { Input } from '@lenster/ui';
import { t } from '@lingui/macro';
import type { Dispatch, FC } from 'react';
import { useState } from 'react';
import type { IGif } from 'src/types/giphy';
import { useDebounce } from 'usehooks-ts';

import Categories from './Categories';
import Gifs from './Gifs';

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

  return (
    <>
      <div className="m-3">
        <Input
          type="text"
          placeholder={t`Search for GIFs`}
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
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
