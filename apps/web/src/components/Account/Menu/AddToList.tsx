import { MenuItem } from "@headlessui/react";
import { ListBulletIcon } from "@heroicons/react/24/outline";
import type { Profile } from "@hey/lens";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";

interface AddToListProps {
  account: Profile;
}

const AddToList: FC<AddToListProps> = ({ account }) => {
  const { setShowAddToListModal } = useGlobalModalStateStore();

  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          "m-2 flex cursor-pointer items-center space-x-2 rounded-lg px-2 py-1.5 text-sm"
        )
      }
      onClick={() => setShowAddToListModal(true, account)}
    >
      <ListBulletIcon className="size-4" />
      <div>Add to list</div>
    </MenuItem>
  );
};

export default AddToList;
