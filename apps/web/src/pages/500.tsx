import type { FC } from "react";

import MetaTags from "@components/Common/MetaTags";
import { heyFont } from "@helpers/fonts";
import { HomeIcon } from "@heroicons/react/24/outline";
import { APP_NAME } from "@hey/data/constants";
import { Button, H2 } from "@hey/ui";
import cn from "@hey/ui/cn";
import Link from "next/link";

const Custom500: FC = () => {
  return (
    <div className={cn("page-center flex-col", heyFont.className)}>
      <MetaTags title={`500 • ${APP_NAME}`} />
      <div className="py-10 text-center">
        <H2 className="mb-4">Looks like something went wrong!</H2>
        <div className="ld-text-gray-500 mb-4">
          We track these errors automatically, but if the problem persists feel
          free to contact us. In the meantime, try refreshing.
        </div>
        <Link href="/">
          <Button
            className="mx-auto flex items-center"
            icon={<HomeIcon className="size-4" />}
            size="lg"
          >
            Go to home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Custom500;
