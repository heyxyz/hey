import UserProfile from '@components/Shared/UserProfile';
import type { Profile } from 'lens';
import React from 'react';
import { Image } from 'ui';

interface MessageHeaderProps {
  profile?: Profile;
}

export default function MessageHeader({ profile }: MessageHeaderProps) {
  return (
    <section className="flex w-full justify-between border-b px-5	py-2.5	">
      <div className="flex items-center">
        <UserProfile profile={profile as Profile} />
      </div>
      <div className="flex items-center gap-4	">
        <img className="cursor-pointer" src="/push/video.svg" alt="video icon" />
        <div className="border-brand-500	 flex h-8 w-20 cursor-pointer	items-center justify-center gap-2 rounded-lg border">
          <Image className="h-3	w-3" src="/push/addfriend.svg" alt="" />
          <span className="text-brand-500 text-sm">Follow</span>
        </div>
      </div>
    </section>
  );
}
