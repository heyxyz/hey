import ToggleWithHelper from "@components/Shared/ToggleWithHelper";
import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { SwatchIcon } from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import { Events } from "@hey/data/events";
import axios from "axios";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { usePreferencesStore } from "src/store/persisted/usePreferencesStore";

const IncludeLowScore: FC = () => {
  const { includeLowScore, setIncludeLowScore } = usePreferencesStore();
  const [updating, setUpdating] = useState(false);

  const toggleIncludeLowScore = async () => {
    try {
      setUpdating(true);
      await axios.post(
        `${HEY_API_URL}/preferences/update`,
        { includeLowScore: !includeLowScore },
        { headers: getAuthApiHeaders() }
      );

      setIncludeLowScore(!includeLowScore);
      trackEvent(Events.Account.UpdateSettings, {
        type: "toggle_include_low_score"
      });
      toast.success("Notification preference updated");
    } catch (error) {
      errorToast(error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <ToggleWithHelper
      description="Turn on low-signal notification filter"
      disabled={updating}
      heading="Notification Signal filter"
      icon={<SwatchIcon className="size-5" />}
      on={includeLowScore}
      setOn={toggleIncludeLowScore}
    />
  );
};

export default IncludeLowScore;
