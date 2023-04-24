import React from 'react';
import { Image } from 'ui';

export default function MessageHeader() {
  return (
    <section className="flex w-full justify-between border-b px-5	py-2.5	">
      <div className="flex gap-x-2">
        <img className="h-12 w-12	rounded-full" src="/user.svg" alt="" />
        <div>
          <h5 className="text-base font-bold">Sasi</h5>
          <p className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-sm text-transparent">
            @sasicodes
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4	">
        <img className="cursor-pointer" src="/push/video.svg" alt="video icon" />
        <div className="flex	 h-8 w-20 cursor-pointer items-center	justify-center gap-2 rounded-lg border border-violet-500">
          <Image className="h-3	w-3" src="/push/addfriend.svg" alt="" />
          <span className="text-sm text-violet-500">Follow</span>
        </div>
      </div>
    </section>
  );
}
