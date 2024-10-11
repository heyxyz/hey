import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import profileThemeFonts, { Font } from "@helpers/profileThemeFonts";
import { HEY_API_URL } from "@hey/data/constants";
import camelCaseToReadable from "@hey/helpers/camelCaseToReadable";
import { Button, Select } from "@hey/ui";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import { useProfileThemeStore } from "src/store/non-persisted/useProfileThemeStore";

const UpdateTheme: FC = () => {
  const { theme, setTheme } = useProfileThemeStore();
  const [updating, setUpdating] = useState(false);
  const queryClient = useQueryClient();

  const resetTheme = async () => {
    setUpdating(true);
    try {
      await toast.promise(
        axios.post(`${HEY_API_URL}/profile/theme/reset`, undefined, {
          headers: getAuthApiHeaders()
        }),
        {
          error: "Failed to reset profile theme",
          loading: "Resetting profile theme...",
          success: "Profile theme reset successfully"
        }
      );
      queryClient.invalidateQueries({ queryKey: ["getProfileDetails"] });
      setTheme(null);
    } finally {
      setUpdating(false);
    }
  };

  const updateTheme = async () => {
    setUpdating(true);
    try {
      await toast.promise(
        axios.post(`${HEY_API_URL}/profile/theme/update`, theme, {
          headers: getAuthApiHeaders()
        }),
        {
          error: "Failed to update profile theme",
          loading: "Updating profile theme...",
          success: "Profile theme updated successfully"
        }
      );
      queryClient.invalidateQueries({ queryKey: ["getProfileDetails"] });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="label">Overview font style</div>
        <Select
          showSearch
          onChange={(value) => setTheme({ ...theme, overviewFontStyle: value })}
          options={Object.values(Font).map((font) => ({
            label: camelCaseToReadable(font),
            htmlLabel: (
              <div className={profileThemeFonts(font)}>
                {camelCaseToReadable(font)}
              </div>
            ),
            selected: theme?.overviewFontStyle === font,
            value: font
          }))}
        />
      </div>
      <div>
        <div className="label">Publication font style</div>
        <Select
          showSearch
          onChange={(value) =>
            setTheme({ ...theme, publicationFontStyle: value })
          }
          options={Object.values(Font).map((font) => ({
            label: camelCaseToReadable(font),
            htmlLabel: (
              <div className={profileThemeFonts(font)}>
                {camelCaseToReadable(font)}
              </div>
            ),
            selected: theme?.publicationFontStyle === font,
            value: font
          }))}
        />
      </div>
      <div className="flex items-center justify-between space-x-3">
        <Button
          variant="danger"
          size="lg"
          className="w-full"
          onClick={resetTheme}
          disabled={updating}
        >
          Reset
        </Button>
        <Button
          size="lg"
          className="w-full"
          onClick={updateTheme}
          disabled={updating}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default UpdateTheme;
