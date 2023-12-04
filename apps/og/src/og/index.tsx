import type { ResvgRenderOptions } from '@resvg/resvg-js';
import type { SatoriOptions } from 'satori';

import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import satori from 'satori';

import type { ILayout, ILayoutConfig } from '../layouts/types';

import { OG_HEIGHT, OG_WIDTH } from '../constants';

const fonts: SatoriOptions['fonts'] = [
  {
    data: fs.readFileSync('public/fonts/Inter-Regular.ttf'),
    name: 'Inter',
    style: 'normal',
    weight: 400
  },
  {
    data: fs.readFileSync('public/fonts/Inter-Bold.ttf'),
    name: 'Inter',
    style: 'bold' as any,
    weight: 800
  }
];

export const renderLayoutToSVG = async ({
  config,
  layout
}: {
  config: ILayoutConfig;
  layout: ILayout;
}) => {
  const { Component } = layout;

  const svg = await satori(<Component config={config} />, {
    fonts,
    height: OG_HEIGHT,
    width: OG_WIDTH
  });

  return svg;
};

const resvgOpts: ResvgRenderOptions = {
  fitTo: {
    mode: 'width',
    value: OG_WIDTH
  },
  imageRendering: 0,
  shapeRendering: 2,
  textRendering: 2
};

export const renderSVGToPNG = async (svg: string) => {
  const resvg = new Resvg(svg, resvgOpts);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return pngBuffer;
};
