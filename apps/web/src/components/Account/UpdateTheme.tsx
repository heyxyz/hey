import accountThemeFonts, { Font } from "@helpers/accountThemeFonts";
import errorToast from "@helpers/errorToast";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import { GET_PREFERENCES_QUERY_KEY } from "@hey/helpers/api/getPreferences";
import camelCaseToReadable from "@hey/helpers/camelCaseToReadable";
import { Button, Select } from "@hey/ui";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import { useAccountThemeStore } from "src/store/persisted/useAccountThemeStore";

const UpdateTheme: FC = () => {
  const { theme, setTheme } = useAccountThemeStore();
  const [updating, setUpdating] = useState(false);
  const queryClient = useQueryClient();

  const handleResetTheme = async () => {
    setUpdating(true);
    try {
      await axios.post(`${HEY_API_URL}/preferences/theme/reset`, undefined, {
        headers: getAuthApiHeaders()
      });
      queryClient.invalidateQueries({ queryKey: [GET_PREFERENCES_QUERY_KEY] });
      setTheme(null);
      toast.success("Profile theme reset");
    } catch (error) {
      errorToast(error);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateTheme = async () => {
    setUpdating(true);
    try {
      await axios.post(`${HEY_API_URL}/preferences/theme/update`, theme, {
        headers: getAuthApiHeaders()
      });
      queryClient.invalidateQueries({ queryKey: [GET_PREFERENCES_QUERY_KEY] });
      toast.success("Profile theme updated");
    } catch (error) {
      errorToast(error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="label">Font style</div>
        <Select
          showSearch
          onChange={(value) => setTheme({ ...theme, fontStyle: value })}
          options={Object.values(Font).map((font) => ({
            label: camelCaseToReadable(font),
            htmlLabel: (
              <div className={accountThemeFonts(font)}>
                {camelCaseToReadable(font)}
              </div>
            ),
            selected: theme?.fontStyle === font,
            value: font
          }))}
        />
      </div>
      <div className="flex items-center justify-between space-x-3">
        <Button
          variant="danger"
          size="lg"
          className="w-full"
          onClick={handleResetTheme}
          disabled={updating}
        >
          Reset
        </Button>
        <Button
          size="lg"
          className="w-full"
          onClick={handleUpdateTheme}
          disabled={updating}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default UpdateTheme;
