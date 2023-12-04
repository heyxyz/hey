import React from 'react';
import { z } from 'zod';

import type { ILayout } from './types';

import { DocsIllustration } from '../components/DocsIllustration';
import { authors, getAuthor } from './authors';
import { GradientBackground, RLogo } from './utils';

const blogLayoutConfig = z.object({
  Author: z.string(),
  Theme: z.preprocess(
    (v) => v?.toString().toLowerCase(),
    z.enum(['light', 'dark']).default('dark')
  ),
  Title: z.string()
});

export type BlogLayoutConfig = z.infer<typeof blogLayoutConfig>;

const Component: React.FC<{ config: BlogLayoutConfig }> = ({ config }) => {
  const author = getAuthor(config.Author);
  const { length } = config.Title;

  return (
    <div
      style={{
        color: config.Theme === 'light' ? 'black' : `white`
      }}
      tw="relative flex justify-start items-end w-full h-full"
    >
      {/* gradient layers */}
      <GradientBackground theme={config.Theme} />

      {/* main text */}
      <div
        style={{ marginBottom: 80, marginLeft: 96, maxWidth: 740 }}
        tw="flex flex-col text-left"
      >
        <p
          style={{ fontSize: length > 50 ? 48 : 60, lineHeight: 1.4 }}
          tw="font-bold"
        >
          {config.Title}
        </p>

        <div tw="flex items-center mt-6">
          <img
            alt={author.name}
            src={author.image}
            style={{ borderRadius: '100%', height: 56, width: 56 }}
          />
          <p tw="text-3xl opacity-60 ml-7">{config.Author}</p>
        </div>
      </div>

      {/* railway logo */}
      {/* <RLogo
        theme={config.Theme}
        tw="absolute"
        style={{ top: 88, left: 96, width: 88, height: 88 }}
      /> */}
      <RLogo
        style={{ right: 97, top: 106 }}
        theme={config.Theme}
        // @ts-ignore
        tw="absolute"
      />
      <div tw="absolute top-0 right-0 flex">
        <DocsIllustration />
      </div>
    </div>
  );
};

export const blogLayout: ILayout<typeof blogLayoutConfig> = {
  Component,
  config: blogLayoutConfig,
  name: 'blog',
  properties: [
    {
      default: 'Why you should use Config as Code',
      name: 'Title',
      placeholder: 'Blog post title',
      type: 'text'
    },
    {
      default: 'Jake Runzer',
      name: 'Author',
      options: authors.map((author) => author.name),
      type: 'select'
    },
    {
      default: 'dark',
      name: 'Theme',
      options: ['light', 'dark'],
      type: 'select'
    }
  ]
};
