import React from 'react';
import { z } from 'zod';

import type { ILayout } from './types';

import { TemplateIllustration } from '../components/TemplateIllustration';

const templateLayoutConfig = z.object({
  AuthorImage: z.string().nullish(),
  AuthorName: z.string(),
  Category: z.string().nullish(),
  Description: z.string(),
  TemplateImage: z.string().url(),
  Title: z.string()
});

type TemplateLayoutConfig = z.infer<typeof templateLayoutConfig>;

const Component: React.FC<{ config: TemplateLayoutConfig }> = ({ config }) => {
  const {
    AuthorImage,
    AuthorName,
    Category,
    Description,
    TemplateImage,
    Title
  } = config;

  return (
    <div tw="relative flex flex-col w-full h-full">
      <div tw="flex absolute inset-0 w-full h-full">
        <TemplateIllustration />
      </div>
      <div tw="flex flex-col justify-between h-full px-20 pt-20 pb-12">
        <img alt={Title} height={64} src={TemplateImage} width={64} />
        <div tw="flex flex-col gap-4">
          <p tw="text-6xl font-bold text-white">{Title}</p>
          <div tw="flex grow items-end">
            <p tw="mb-12 text-3xl text-gray-500 max-w-[38rem]">{Description}</p>
          </div>
        </div>
        <div tw="mb-1 flex items-end">
          {AuthorName && (
            <div tw="flex items-center mr-16">
              {AuthorImage ? (
                <img
                  alt={AuthorName}
                  height={40}
                  src={AuthorImage}
                  tw="rounded-full"
                  width={40}
                />
              ) : (
                <svg
                  fill="none"
                  height="40"
                  viewBox="0 0 16 16"
                  width="40"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.3333 14V12.6667C13.3333 11.9594 13.0523 11.2811 12.5522 10.781C12.0521 10.281 11.3739 10 10.6666 10H5.33329C4.62605 10 3.94777 10.281 3.44767 10.781C2.94758 11.2811 2.66663 11.9594 2.66663 12.6667V14M10.6666 4.66667C10.6666 6.13943 9.47272 7.33333 7.99996 7.33333C6.5272 7.33333 5.33329 6.13943 5.33329 4.66667C5.33329 3.19391 6.5272 2 7.99996 2C9.47272 2 10.6666 3.19391 10.6666 4.66667Z"
                    stroke="#868593"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                  />
                </svg>
              )}
              <p tw="ml-5 text-gray-500 text-[28px]">{AuthorName}</p>
            </div>
          )}
          {Category && (
            <div tw="flex items-center">
              <svg
                fill="none"
                height="40"
                viewBox="0 0 40 40"
                width="40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M36.6668 31.6667C36.6668 32.5507 36.3156 33.3986 35.6905 34.0237C35.0654 34.6488 34.2176 35 33.3335 35H6.66683C5.78277 35 4.93493 34.6488 4.30981 34.0237C3.68469 33.3986 3.3335 32.5507 3.3335 31.6667V8.33333C3.3335 7.44928 3.68469 6.60143 4.30981 5.97631C4.93493 5.35119 5.78277 5 6.66683 5H15.0002L18.3335 10H33.3335C34.2176 10 35.0654 10.3512 35.6905 10.9763C36.3156 11.6014 36.6668 12.4493 36.6668 13.3333V31.6667Z"
                  stroke="#868593"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                />
              </svg>

              <p tw="ml-5 text-gray-500 text-[28px]">{Category}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const templateLayout: ILayout<typeof templateLayoutConfig> = {
  Component,
  config: templateLayoutConfig,
  name: 'template',
  properties: [
    {
      default: 'https://devicons.railway.app/i/umami-dark.svg',
      name: 'TemplateImage',
      type: 'text'
    },
    {
      default: 'Umami',
      name: 'Title',
      type: 'text'
    },
    {
      default:
        'Umami is a simple, fast, website analytics tool for those who care about privacy.',
      name: 'Description',
      type: 'text'
    },
    {
      default: 'https://avatars.githubusercontent.com/u/10681116?v=4',
      name: 'AuthorImage',
      type: 'text'
    },
    {
      default: 'Percy',
      name: 'AuthorName',
      type: 'text'
    },
    {
      default: 'Analytics',
      name: 'Category',
      type: 'text'
    }
  ]
};
