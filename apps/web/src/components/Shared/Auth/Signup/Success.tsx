import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { type FC } from 'react';

const Success: FC = () => {
  return (
    <div className="m-8 flex flex-col items-center justify-center">
      <div className="text-xl font-bold">Waaa-hey! You got your profile!</div>
      <div className="ld-text-gray-500 mt-3 text-center font-semibold">
        Welcome to decentralised social where everything is sooooooooooooo much
        better! 🎉
      </div>
      <img
        alt="Dizzy emoji"
        className="mx-auto mt-8 size-14"
        src={`${STATIC_IMAGES_URL}/emojis/dizzy.png`}
      />
    </div>
  );
};

export default Success;
