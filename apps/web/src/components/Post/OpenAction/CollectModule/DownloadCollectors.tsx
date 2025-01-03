import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import type { AnyPost } from "@hey/indexer";
import { Tooltip } from "@hey/ui";
import { useFlag } from "@unleash/proxy-client-react";
import type { AxiosResponse } from "axios";
import axios from "axios";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface DownloadCollectorsProps {
  post: AnyPost;
}

const DownloadCollectors: FC<DownloadCollectorsProps> = ({ post }) => {
  const { currentAccount } = useAccountStore();
  const [disabled, setDisabled] = useState(false);
  const enabled = useFlag(FeatureFlag.ExportCollects);

  if (!enabled) {
    return null;
  }

  if (currentAccount?.address !== post.author.address) {
    return null;
  }

  const handleClick = (): void => {
    setDisabled(true);
    toast.promise(
      axios
        .get(`${HEY_API_URL}/export/collects`, {
          headers: getAuthApiHeaders(),
          params: { id: post.id },
          responseType: "blob"
        })
        .then((response: AxiosResponse<Blob>) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `collect_addresses_${post.id}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .finally(() => setDisabled(false)),
      {
        error: "Error downloading collectors",
        loading: "Downloading collectors...",
        success: "Collectors downloaded"
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
