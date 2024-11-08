import { ImpactFeedbackStyle, impactAsync } from "expo-haptics";

export const haptic = () => {
  impactAsync(ImpactFeedbackStyle.Soft);
};
