import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import type { Moderation } from "@hey/types/hey";
import { Checkbox } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";

interface AIModerationProps {
  id: string;
}

const AIModeration: FC<AIModerationProps> = ({ id }) => {
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
    queryKey: ["getAIModeration", id]
  });

  if (!data) {
    return null;
  }

  const flagged = data.flagged;
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

  const harassmentScore = Number(data.harassment_score).toFixed(2);
  const harassmentThreateningScore = Number(
    data.harassment_threatening_score
  ).toFixed(2);
  const sexualScore = Number(data.sexual_score).toFixed(2);
  const hateScore = Number(data.hate_score).toFixed(2);
  const hateThreateningScore = Number(data.hate_threatening_score).toFixed(2);
  const illicitScore = Number(data.illicit_score).toFixed(2);
  const illicitViolentScore = Number(data.illicit_violent_score).toFixed(2);
  const selfHarmIntentScore = Number(data.self_harm_intent_score).toFixed(2);
  const selfHarmInstructionsScore = Number(
    data.self_harm_instructions_score
  ).toFixed(2);
  const selfHarmScore = Number(data.self_harm_score).toFixed(2);
  const sexualMinorsScore = Number(data.sexual_minors_score).toFixed(2);
  const violenceScore = Number(data.violence_score).toFixed(2);
  const violenceGraphicScore = Number(data.violence_graphic_score).toFixed(2);

  return (
    <div className="space-y-3 pt-2">
      <div className="font-bold text-sm">OpenAI Moderation</div>
      <div className="flex flex-wrap gap-3 text-xs">
        <Checkbox checked={flagged} label="Flagged" disabled />
        <Checkbox
          checked={harassment}
          label={`Harassment (${harassmentScore})`}
          disabled
        />
        <Checkbox
          checked={harassmentThreatening}
          label={`Harassment/Threatening (${harassmentThreateningScore})`}
          disabled
        />
        <Checkbox checked={sexual} label={`Sexual (${sexualScore})`} disabled />
        <Checkbox checked={hate} label={`Hate (${hateScore})`} disabled />
        <Checkbox
          checked={hateThreatening}
          label={`Hate/Threatening (${hateThreateningScore})`}
          disabled
        />
        <Checkbox
          checked={illicit}
          label={`Illicit (${illicitScore})`}
          disabled
        />
        <Checkbox
          checked={illicitViolent}
          label={`Illicit/Violent (${illicitViolentScore})`}
          disabled
        />
        <Checkbox
          checked={selfHarmIntent}
          label={`Self-harm/Intent (${selfHarmIntentScore})`}
          disabled
        />
        <Checkbox
          checked={selfHarmInstructions}
          label={`Self-harm/Instructions (${selfHarmInstructionsScore})`}
          disabled
        />
        <Checkbox
          checked={selfHarm}
          label={`Self-harm (${selfHarmScore})`}
          disabled
        />
        <Checkbox
          checked={sexualMinors}
          label={`Sexual/Minors (${sexualMinorsScore})`}
          disabled
        />
        <Checkbox
          checked={violence}
          label={`Violence (${violenceScore})`}
          disabled
        />
        <Checkbox
          checked={violenceGraphic}
          label={`Violence/Graphic (${violenceGraphicScore})`}
          disabled
        />
      </div>
    </div>
  );
};

export default AIModeration;
