/** @type { import('@storybook/nextjs').StorybookConfig } */
const config = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-styling',
      options: { postCss: true }
    },
    {
      name: 'storybook-addon-turbo-build',
      options: {
        optimizationLevel: 2
      }
    }
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {}
  },
  core: {
    disableTelemetry: true
  },
  docs: {
    autodocs: 'tag'
  }
};
export default config;
