import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';

const haptic = () => {
  impactAsync(ImpactFeedbackStyle.Light);
};

export default haptic;
