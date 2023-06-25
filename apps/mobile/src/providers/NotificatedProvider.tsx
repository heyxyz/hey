import {
  createNotifications,
  ZoomInDownZoomOutUp
} from 'react-native-notificated';

import { theme } from '../constants/theme';

export const { NotificationsProvider } = createNotifications({
  duration: 3000,
  gestureConfig: {
    direction: 'full',
    x: { activationDistances: 50, activationVelocities: 200 },
    y: { activationDistances: 50, activationVelocities: 200 }
  },
  animationConfig: ZoomInDownZoomOutUp,
  defaultStylesSettings: {
    globalConfig: {
      defaultIconType: 'monochromatic',
      borderType: 'no-border',
      borderRadius: 30,
      bgColor: theme.colors.background
    },
    darkMode: true
  }
});
