import type { FC } from "react";

import { Image } from "./Image";

interface StackedAvatarsProps {
  avatars: string[];
  limit?: number;
}

const StackedAvatars: FC<StackedAvatarsProps> = ({ avatars, limit }) => {
  if (!avatars) {
    return null;
  }

  return (
    <span className="flex">
      <span className="-space-x-2 contents">
        {avatars.slice(0, limit)?.map((avatar, index) => (
          <Image
            alt={avatar}
            className="size-5 rounded-full border dark:border-gray-700"
            key={avatar + index}
            src={avatar}
          />
        ))}
      </span>
    </span>
  );
};

export default StackedAvatars;
