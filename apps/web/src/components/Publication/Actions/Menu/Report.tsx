import type { MirrorablePublication } from "@hey/lens";
import type { FC } from "react";

import { MenuItem } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import cn from "@hey/ui/cn";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";

interface ReportProps {
  publication: MirrorablePublication;
}

const Report: FC<ReportProps> = ({ publication }) => {
  const { setShowPublicationReportModal } = useGlobalModalStateStore();

  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          "m-2 block cursor-pointer rounded-lg px-2 py-1.5 text-red-500 text-sm"
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
        setShowPublicationReportModal(true, publication.id);
      }}
    >
      <div className="flex items-center space-x-2">
        <ExclamationTriangleIcon className="size-4" />
        <div>Report post</div>
      </div>
    </MenuItem>
  );
};

export default Report;
