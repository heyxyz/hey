import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { Leafwatch } from "@helpers/leafwatch";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import { PUBLICATION } from "@hey/data/tracking";
import type { AnyPublication } from "@hey/lens";
import { Tooltip } from "@hey/ui";
import { useFlag } from "@unleash/proxy-client-react";
import type { AxiosResponse } from "axios";
import axios from "axios";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import { useProfileStore } from "src/store/persisted/useProfileStore";

interface DownloadCollectorsProps {
  publication: AnyPublication;
}

const DownloadCollectors: FC<DownloadCollectorsProps> = ({ publication }) => {
  const { currentProfile } = useProfileStore();
  const [disabled, setDisabled] = useState(false);
  const enabled = useFlag(FeatureFlag.ExportCollects);

  if (!enabled) {
    return null;
  }

  if (currentProfile?.id !== publication.by.id) {
    return null;
  }

  const handleClick = (): void => {
    setDisabled(true);
    toast.promise(
      axios
        .get(`${HEY_API_URL}/export/collects`, {
          headers: getAuthApiHeaders(),
          params: { id: publication.id },
          responseType: "blob"
        })
        .then((response: AxiosResponse<Blob>) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `collect_addresses_${publication.id}.csv`
          );
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          Leafwatch.track(PUBLICATION.COLLECT_MODULE.DOWNLOAD_COLLECTORS);
        })
        .finally(() => setDisabled(false)),
      {
        error: "Error downloading collectors",
        loading: "Downloading collectors...",
        success: "Collectors downloaded successfully"
      }
    );
  };

  return (
    <Tooltip content="Export addresses as CSV" placement="top">
      <button disabled={disabled} onClick={handleClick} type="button">
        <ArrowDownTrayIcon className="size-4" />
      </button>
    </Tooltip>
  );
};

export default DownloadCollectors;
