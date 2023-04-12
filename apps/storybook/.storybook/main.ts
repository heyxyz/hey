import { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-styling',
      options: { postCss: true }
    },
    {
      name: 'storybook-addon-turbo-build',
      options: { optimizationLevel: 2 }
    }
  ],
  framework: {
    name: '@storybook/nextjs',
    options: { fastRefresh: true }
  },
  core: {
    disableTelemetry: true,
    enableCrashReports: false
  },
  features: {
    storyStoreV7: true
  },
  docs: {
    autodocs: 'tag'
  }
};

export default config;
