import type { AnyPublication } from "@hey/lens";
import type { Dispatch, FC, SetStateAction } from "react";

import { MenuItem } from "@headlessui/react";
import errorToast from "@helpers/errorToast";
import { Leafwatch } from "@helpers/leafwatch";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { Errors } from "@hey/data/errors";
import { PUBLICATION } from "@hey/data/tracking";
import { isMirrorPublication } from "@hey/helpers/publicationHelpers";
import { useHidePublicationMutation } from "@hey/lens";
import { useApolloClient } from "@hey/lens/apollo";
import cn from "@hey/ui/cn";
import { toast } from "react-hot-toast";
import { useProfileStore } from "src/store/persisted/useProfileStore";

interface MirrorProps {
  isLoading: boolean;
  publication: AnyPublication;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const UndoMirror: FC<MirrorProps> = ({
  isLoading,
  publication,
  setIsLoading
}) => {
  const { currentProfile } = useProfileStore();
  const { cache } = useApolloClient();

  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const updateCache = () => {
    cache.modify({
      fields: { mirrors: () => targetPublication.stats.mirrors - 1 },
      id: cache.identify(targetPublication.stats)
    });
    cache.evict({
      id: `${publication?.__typename}:${publication?.id}`
    });
  };

  const onError = (error?: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [hidePost] = useHidePublicationMutation({
    onCompleted: () => {
      Leafwatch.track(PUBLICATION.UNDO_MIRROR);
      toast.success("Undone mirror successfully");
    },
    update: updateCache
  });

  const undoMirror = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    try {
      setIsLoading(true);

      return await hidePost({
        variables: { request: { for: publication.id } }
      });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          "m-2 block cursor-pointer rounded-lg px-4 py-1.5 text-red-500 text-sm"
        )
      }
      disabled={isLoading}
      onClick={undoMirror}
    >
      <div className="flex items-center space-x-2">
        <ArrowsRightLeftIcon className="size-4" />
        <div>Undo mirror</div>
      </div>
    </MenuItem>
  );
};

export default UndoMirror;
