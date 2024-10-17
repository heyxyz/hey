import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import { Checkbox } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import { useFlag } from "@unleash/proxy-client-react";
import axios from "axios";
import type { FC } from "react";

interface AIModerationProps {
  id: string;
}

const AIModeration: FC<AIModerationProps> = ({ id }) => {
  const isStaff = useFlag(FeatureFlag.Staff);

  const getAIModeration = async () => {
    const response = await axios.post(
      `${HEY_API_URL}/ai/internal/moderation`,
      { id },
      { headers: getAuthApiHeaders() }
    );

    return response.data?.result;
  };

  const { data } = useQuery({
    queryFn: getAIModeration,
    queryKey: ["getAIModeration", id],
    enabled: isStaff
  });

  if (!isStaff) {
    return null;
  }

  if (!data) {
    return null;
  }

  if (!data.flagged) {
    return null;
  }

  const harassment = data.categories["harassment"];
  const threatening = data.categories["harassment/threatening"];
  const sexual = data.categories["sexual"];
  const hate = data.categories["hate"];
  const illicit = data.categories["illicit"];
  const illicitViolent = data.categories["illicit/violent"];
  const selfHarmIntent = data.categories["self-harm/intent"];
  const selfHarmInstructions = data.categories["self-harm/instructions"];
  const selfHarm = data.categories["self-harm"];
  const sexualMinors = data.categories["sexual/minors"];
  const violence = data.categories["violence"];
  const violenceGraphic = data.categories["violence/graphic"];

  return (
    <>
      <div className="divider" />
      <div className="m-5 flex flex-wrap gap-2">
        <Checkbox checked={harassment} label="Harassment" disabled />
        <Checkbox
          checked={threatening}
          label="Harassment/Threatening"
          disabled
        />
        <Checkbox checked={sexual} label="Sexual" disabled />
        <Checkbox checked={hate} label="Hate" disabled />
        <Checkbox checked={illicit} label="Illicit" disabled />
        <Checkbox checked={illicitViolent} label="Illicit/Violent" disabled />
        <Checkbox checked={selfHarmIntent} label="Self-harm/Intent" disabled />
        <Checkbox
          checked={selfHarmInstructions}
          label="Self-harm/Instructions"
          disabled
        />
        <Checkbox checked={selfHarm} label="Self-harm" disabled />
        <Checkbox checked={sexualMinors} label="Sexual/Minors" disabled />
        <Checkbox checked={violence} label="Violence" disabled />
        <Checkbox checked={violenceGraphic} label="Violence/Graphic" disabled />
      </div>
    </>
  );
};

export default AIModeration;
