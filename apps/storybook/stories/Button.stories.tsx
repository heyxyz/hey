import type { Meta, StoryFn } from '@storybook/react';
import { Button } from 'ui';

export default {
  title: 'Button',
  component: Button
} as Meta<typeof Button>;

export const Default = () => <Button>Button</Button>;
export const Playground: StoryFn = (args: typeof Button) => <Button {...args}>Button</Button>;
