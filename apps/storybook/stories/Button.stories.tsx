import type { Meta, StoryFn } from '@storybook/react';
import { Button } from 'ui';

export default {
  title: 'Button',
  component: Button,
  argsTypes: {
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg']
    },
    variant: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'warning', 'super', 'danger']
    },
    outline: {
      control: { type: 'boolean' }
    },
    disabled: {
      control: { type: 'boolean' }
    }
  }
} as Meta<typeof Button>;

export const Default = () => <Button>Button</Button>;
export const Playground: StoryFn<typeof Button> = (args) => <Button {...args}>Button</Button>;
