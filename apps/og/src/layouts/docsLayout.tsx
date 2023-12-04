import React from 'react';
import { z } from 'zod';

import type { ILayout } from './types';

import { DocsIllustration } from '../components/DocsIllustration';
import { RLogo } from './utils';

const docsLayoutConfig = z.object({
  Page: z.string(),
  Url: z.string().nullish()
});

export type DocsLayoutConfig = z.infer<typeof docsLayoutConfig>;

const Component: React.FC<{ config: DocsLayoutConfig }> = ({ config }) => {
  const url =
    (config.Url ?? '').trim() === ''
      ? 'docs.railway.app'
      : (config.Url as string);
  return (
    <div
      style={{
        background: `#13111C`
      }}
      tw="relative flex justify-start items-end w-full h-full"
    >
      {/* gradient layers */}
      <div
        style={{
          background:
            'linear-gradient(327.21deg, rgba(33, 0, 75, 0.35) 3.65%, rgba(60, 0, 136, 0) 40.32%)'
        }}
        tw="absolute inset-0"
      />
      <div
        style={{
          background:
            'linear-gradient(245.93deg, rgba(209, 21, 111, 0.26) 0%, rgba(209, 25, 80, 0) 36.63%)'
        }}
        tw="absolute inset-0"
      />
      <div
        style={{
          background:
            'linear-gradient(147.6deg, rgba(58, 19, 255, 0) 29.79%, rgba(98, 19, 255, 0.1) 85.72%)'
        }}
        tw="absolute inset-0"
      />

      {/* main text */}
      <div
        style={{ marginBottom: 90, marginLeft: 96, maxWidth: 740 }}
        tw="flex flex-col text-left border"
      >
        <p style={{ lineHeight: 1.2 }} tw="text-8xl text-white font-bold">
          {config.Page}
        </p>
      </div>

      {/* docs link  */}

      <p
        style={{ color: 'hsl(270, 70%, 65%)' }}
        tw="absolute right-10 bottom-4 text-xl"
      >
        {url}
      </p>

      {/* railway logo */}
      <RLogo
        style={{ right: 97, top: 106 }}
        // @ts-ignore
        tw="absolute"
      />

      {/* illustration */}
      <div tw="absolute top-0 right-0 flex">
        <DocsIllustration />
      </div>
    </div>
  );
};

export const docsLayout: ILayout<typeof docsLayoutConfig> = {
  Component,
  config: docsLayoutConfig,
  name: 'docs',
  properties: [
    {
      default: 'Railway Documentation',
      name: 'Page',
      placeholder: 'Text to display',
      type: 'text'
    },
    {
      default: 'docs.railway.app',
      name: 'Url',
      placeholder: 'Url to display',
      type: 'text'
    }
  ]
};
