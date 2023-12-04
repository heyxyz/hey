import React from 'react';
import { z } from 'zod';

import type { ILayout } from './types';

import { GradientBackground, RLogo } from './utils';

const starterLayoutConfig = z.object({
  Icon: z.enum(['Show', 'Hide']).default('Show'),
  Name: z.string().default(''),
  URL: z.string().nullish()
});

export type BlogLayoutConfig = z.infer<typeof starterLayoutConfig>;

const Component: React.FC<{ config: BlogLayoutConfig }> = ({ config }) => {
  const iconName = config.Name.trim() === '' ? 'Railway' : config.Name;
  const iconURL = `https://devicons.railway.app/${iconName}?variant=light`;
  const hideIcon = config.Icon === 'Hide';

  return (
    <div tw="relative flex justify-start items-end w-full h-full text-white">
      {/* gradient layers */}
      <GradientBackground />

      {/* main text */}
      <div
        style={{ marginBottom: 80, marginLeft: 96, maxWidth: 800 }}
        tw="flex flex-col text-left font-bold"
      >
        {!hideIcon && (
          <img src={iconURL} style={{ height: 108, width: 108 }} tw="mb-10" />
        )}

        <p style={{ lineHeight: 1.5 }} tw="flex flex-wrap text-7xl">
          Deploy{' '}
          <span style={{ color: '#C049FF' }} tw="mx-3">
            {config.Name}
          </span>
          <br />
          on Railway
        </p>
      </div>

      {config.URL && (
        <div tw="absolute right-20 bottom-8 text-lg opacity-40">
          {config.URL}
        </div>
      )}

      {/* railway logo */}
      <RLogo
        style={{ height: 60, right: 96, top: 66, width: 60 }}
        // @ts-ignore
        tw="absolute"
      />
    </div>
  );
};

export const starterLayout: ILayout<typeof starterLayoutConfig> = {
  Component,
  config: starterLayoutConfig,
  name: 'starter',
  properties: [
    {
      default: 'BlitzJS',
      name: 'Name',
      placeholder: 'Starter title',
      type: 'text'
    },
    {
      name: 'URL',
      placeholder: 'github.com/railwayapp/starters',
      type: 'text'
    },
    {
      default: 'Show',
      name: 'Icon',
      options: ['Show', 'Hide'],
      type: 'select'
    }
  ]
};
