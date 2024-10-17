import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import type { Moderation } from "@hey/types/hey";
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

  const getAIModeration = async (): Promise<Moderation | null> => {
    try {
      const response = await axios.post(
        `${HEY_API_URL}/ai/internal/moderation`,
        { id },
        { headers: getAuthApiHeaders() }
      );

      return response.data?.result;
    } catch {
      return null;
    }
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

  const harassment = data.harassment;
  const harassmentThreatening = data.harassment_threatening;
  const sexual = data.sexual;
  const hate = data.hate;
  const hateThreatening = data.hate_threatening;
  const illicit = data.illicit;
  const illicitViolent = data.illicit_violent;
  const selfHarmIntent = data.self_harm_intent;
  const selfHarmInstructions = data.self_harm_instructions;
  const selfHarm = data.self_harm;
  const sexualMinors = data.sexual_minors;
  const violence = data.violence;
  const violenceGraphic = data.violence_graphic;

  return (
    <>
      <div className="divider" />
      <div className="m-5 flex flex-wrap gap-3 text-xs">
        <Checkbox checked={harassment} label="Harassment" disabled />
        <Checkbox
          checked={harassmentThreatening}
          label="Harassment/Threatening"
          disabled
        />
        <Checkbox checked={sexual} label="Sexual" disabled />
        <Checkbox checked={hate} label="Hate" disabled />
        <Checkbox checked={hateThreatening} label="Hate/Threatening" disabled />
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
