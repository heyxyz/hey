import type { ChangeEvent, FC, Ref } from 'react';

import { PhotoIcon } from '@heroicons/react/24/outline';
import { ATTACHMENT } from '@hey/data/constants';
import imageKit from '@hey/lib/imageKit';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import { Image, Spinner } from '@hey/ui';
import cn from '@hey/ui/cn';
import errorToast from '@lib/errorToast';
import { uploadFileToIPFS } from '@lib/uploadToIPFS';
import { useState } from 'react';

interface CoverImageProps {
  cover: string;
  expandCover: (url: string) => void;
  imageRef: Ref<HTMLImageElement>;
  isNew: boolean;
  setCover: (previewUri: string, url: string) => void;
}

const CoverImage: FC<CoverImageProps> = ({
  cover,
  expandCover,
  imageRef,
  isNew = false,
  setCover
}) => {
  const [loading, setLoading] = useState(false);

  const onError = (error: any) => {
    setLoading(false);
    errorToast(error);
  };

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      try {
        setLoading(true);
        const file = event.target.files[0];
        const attachment = await uploadFileToIPFS(file);
        setCover(URL.createObjectURL(file), attachment.uri);
      } catch (error) {
        onError(error);
      }
    }
  };

  return (
    <div className="group relative flex-none overflow-hidden">
      <button
        className="flex focus:outline-none"
        onClick={() => expandCover(cover ? sanitizeDStorageUrl(cover) : cover)}
        type="button"
      >
        <Image
          alt={`attachment-audio-cover-${cover}`}
          className="size-24 rounded-xl object-cover md:h-40 md:w-40 md:rounded-none"
          draggable={false}
          onError={({ currentTarget }) => {
            currentTarget.src = cover ? sanitizeDStorageUrl(cover) : cover;
          }}
          ref={imageRef}
          src={cover ? imageKit(sanitizeDStorageUrl(cover), ATTACHMENT) : cover}
        />
      </button>
      {isNew ? (
        <label
          className={cn(
            { invisible: cover, visible: loading && !cover },
            'absolute top-0 grid size-24 cursor-pointer place-items-center bg-gray-100 backdrop-blur-lg group-hover:visible md:h-40 md:w-40 dark:bg-gray-900'
          )}
        >
          {loading && !cover ? (
            <Spinner size="sm" />
          ) : (
            <div className="flex flex-col items-center text-sm text-black opacity-60 dark:text-white">
              <PhotoIcon className="size-5" />
              <span>Add cover</span>
            </div>
          )}
          <input
            accept=".png, .jpg, .jpeg, .svg"
            className="hidden w-full"
            onChange={onChange}
            type="file"
          />
        </label>
      ) : null}
    </div>
  );
};

export default CoverImage;
