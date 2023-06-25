import type { ConfigContext, ExpoConfig } from 'expo/config';

const config = ({ config }: ConfigContext): Partial<ExpoConfig> => {
  if (process.env.MY_ENVIRONMENT === 'production') {
    /* production config */
    return {
      ...config
    };
  } else {
    /* development config */
    return {
      ...config
    };
  }
};

export default config;
