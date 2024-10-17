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

  const harassmentScore = Number.parseFloat(
    data.category_scores["harassment"]
  ).toFixed(2);
  const harassmentThreateningScore = Number.parseFloat(
    data.category_scores["harassment/threatening"]
  ).toFixed(2);
  const sexualScore = Number.parseFloat(data.category_scores["sexual"]).toFixed(
    2
  );
  const hateScore = Number.parseFloat(data.category_scores["hate"]).toFixed(2);
  const illicitScore = Number.parseFloat(
    data.category_scores["illicit"]
  ).toFixed(2);
  const illicitViolentScore = Number.parseFloat(
    data.category_scores["illicit/violent"]
  ).toFixed(2);
  const selfHarmIntentScore = Number.parseFloat(
    data.category_scores["self-harm/intent"]
  ).toFixed(2);
  const selfHarmInstructionsScore = Number.parseFloat(
    data.category_scores["self-harm/instructions"]
  ).toFixed(2);
  const selfHarmScore = Number.parseFloat(
    data.category_scores["self-harm"]
  ).toFixed(2);
  const sexualMinorsScore = Number.parseFloat(
    data.category_scores["sexual/minors"]
  ).toFixed(2);
  const violenceScore = Number.parseFloat(
    data.category_scores["violence"]
  ).toFixed(2);
  const violenceGraphicScore = Number.parseFloat(
    data.category_scores["violence/graphic"]
  ).toFixed(2);

  return (
    <>
      <div className="divider" />
      <div className="m-5 flex flex-wrap gap-2">
        <Checkbox
          checked={harassment}
          label={`Harassment: ${harassmentScore}`}
          disabled
        />
        <Checkbox
          checked={threatening}
          label={`Harassment/Threatening: ${harassmentThreateningScore}`}
          disabled
        />
        <Checkbox checked={sexual} label={`Sexual: ${sexualScore}`} disabled />
        <Checkbox checked={hate} label={`Hate: ${hateScore}`} disabled />
        <Checkbox
          checked={illicit}
          label={`Illicit: ${illicitScore}`}
          disabled
        />
        <Checkbox
          checked={illicitViolent}
          label={`Illicit/Violent: ${illicitViolentScore}`}
          disabled
        />
        <Checkbox
          checked={selfHarmIntent}
          label={`Self-harm/Intent: ${selfHarmIntentScore}`}
          disabled
        />
        <Checkbox
          checked={selfHarmInstructions}
          label={`Self-harm/Instructions: ${selfHarmInstructionsScore}`}
          disabled
        />
        <Checkbox
          checked={selfHarm}
          label={`Self-harm: ${selfHarmScore}`}
          disabled
        />
        <Checkbox
          checked={sexualMinors}
          label={`Sexual/Minors: ${sexualMinorsScore}`}
          disabled
        />
        <Checkbox
          checked={violence}
          label={`Violence: ${violenceScore}`}
          disabled
        />
        <Checkbox
          checked={violenceGraphic}
          label={`Violence/Graphic: ${violenceGraphicScore}`}
          disabled
        />
      </div>
    </>
  );
};

export default AIModeration;
