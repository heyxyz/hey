import { Spinner } from '@components/UI/Spinner';
import { PhotographIcon } from '@heroicons/react/outline';
import getIPFSLink from '@lib/getIPFSLink';
import imageProxy from '@lib/imageProxy';
import uploadToIPFS from '@lib/uploadToIPFS';
import clsx from 'clsx';
import type { ChangeEvent, FC, Ref } from 'react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { COVER, ERROR_MESSAGE } from 'src/constants';

interface Props {
  isNew: boolean;
  cover: string;
  setCover: (url: string, mimeType: string) => void;
  imageRef: Ref<HTMLImageElement>;
}

const CoverImage: FC<Props> = ({ isNew = false, cover, setCover, imageRef }) => {
  const [loading, setLoading] = useState(false);

  const onError = (error: any) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE);
    setLoading(false);
  };

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      try {
        setLoading(true);
        const attachment = await uploadToIPFS(e.target.files);
        setCover(attachment[0].item, attachment[0].type);
      } catch (error) {
        onError(error);
      }
    }
  };

  return (
    <div className="relative flex-none overflow-hidden group">
      <img
        src={cover ? imageProxy(getIPFSLink(cover), COVER) : cover}
        className="object-cover md:w-40 md:h-40 h-24 w-24 rounded-xl md:rounded-none"
        draggable={false}
        alt="cover"
        ref={imageRef}
      />
      {isNew && (
        <label
          className={clsx(
            { visible: loading && !cover, invisible: cover },
            'absolute top-0 grid md:w-40 md:h-40 h-24 w-24 bg-gray-100 dark:bg-gray-900 cursor-pointer place-items-center group-hover:visible backdrop-blur-lg'
          )}
        >
          {loading && !cover ? (
            <Spinner size="sm" />
          ) : (
            <div className="text-sm dark:text-white text-black flex flex-col opacity-60 items-center">
              <PhotographIcon className="w-5 h-5" />
              <span>Add cover</span>
            </div>
          )}
          <input type="file" accept=".png, .jpg, .jpeg, .svg" className="hidden w-full" onChange={onChange} />
        </label>
      )}
    </div>
  );
};

export default CoverImage;
