import ToggleWithHelper from "@components/Shared/ToggleWithHelper";
import errorToast from "@helpers/errorToast";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { Leafwatch } from "@helpers/leafwatch";
import { CodeBracketIcon } from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import { SETTINGS } from "@hey/data/tracking";
import axios from "axios";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { usePreferencesStore } from "src/store/persisted/usePreferencesStore";

const DeveloperMode: FC = () => {
  const { developerMode, setDeveloperMode } = usePreferencesStore();
  const [updating, setUpdating] = useState(false);

  const toggleDeveloperMode = async () => {
    try {
      setUpdating(true);
      await axios.post(
        `${HEY_API_URL}/preferences/update`,
        { developerMode: !developerMode },
        { headers: getAuthApiHeaders() }
      );

      setDeveloperMode(!developerMode);
      toast.success("Developer mode updated");
      Leafwatch.track(SETTINGS.PREFERENCES.TOGGLE_DEVELOPER_MODE, {
        enabled: !developerMode
      });
    } catch (error) {
      errorToast(error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <ToggleWithHelper
      description="Turn on developer mode"
      disabled={updating}
      heading="Developer mode"
      icon={<CodeBracketIcon className="size-5" />}
      on={developerMode}
      setOn={toggleDeveloperMode}
    />
  );
};

export default DeveloperMode;
