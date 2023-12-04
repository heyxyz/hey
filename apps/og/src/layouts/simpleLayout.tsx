import React from 'react';
import { z } from 'zod';

import type { ILayout } from './types';

const simpleLayoutConfig = z.object({
  left: z.string(),
  right: z.string(),
  text: z.string()
});
export type SimpleLayoutConfig = z.infer<typeof simpleLayoutConfig>;

const Component: React.FC<{ config: SimpleLayoutConfig }> = ({ config }) => {
  return (
    <div
      style={{
        background: `linear-gradient(to bottom right, ${config.left}, ${config.right})`
      }}
      tw="flex items-center justify-center text-center px-4 w-full h-full text-8xl text-white font-bold"
    >
      {config.text}
    </div>
  );
};

export const simpleLayout: ILayout<typeof simpleLayoutConfig> = {
  Component,
  config: simpleLayoutConfig,
  name: 'simple',
  properties: [
    {
      default: 'Hello, world!',
      name: 'text',
      placeholder: 'Text to display',
      type: 'text'
    },
    {
      default: 'tomato',
      name: 'left',
      type: 'color'
    },
    {
      default: 'deeppink',
      name: 'right',
      type: 'color'
    }
  ]
};
