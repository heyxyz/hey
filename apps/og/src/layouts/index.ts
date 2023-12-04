import type { ILayout, ILayoutConfig } from './types';

import { blogLayout } from './blogLayout';
import { docsLayout } from './docsLayout';
import { simpleLayout } from './simpleLayout';
import { starterLayout } from './starterLayout';
import { templateLayout } from './templateLayout';

export const layouts: ILayout<any>[] = [
  docsLayout,
  blogLayout,
  starterLayout,
  simpleLayout,
  templateLayout
];

export const getLayout = (layoutName: string): ILayout => {
  const layout = layouts.find((l) => l.name === layoutName);

  if (layout == null) {
    throw new Error(`Layout ${layoutName} not found`);
  }

  return layout;
};

export const getDefaultLayoutConfig = (layout: ILayout): ILayoutConfig => {
  const config: ILayoutConfig = {};

  for (const p of layout.properties) {
    if (p.default != null) {
      config[p.name] = p.default?.toString();
    }
  }

  return config;
};

export const getLayoutConfigFromQuery = async (
  layoutName: string,
  query: Record<string, string | string[] | undefined>
): Promise<ILayoutConfig> => {
  const layout = getLayout(layoutName);

  const config: ILayoutConfig = getDefaultLayoutConfig(layout);
  for (const p of layout.properties) {
    if (query[p.name] != null) {
      config[p.name] = query[p.name]!.toString();
    }
  }

  // Validate layout
  return layout.config.parseAsync(config);
};

export const getLayoutAndConfig = async (
  layoutName: string,
  query: Record<string, string | string[] | undefined>
): Promise<{ config: ILayoutConfig; layout: ILayout }> => {
  const layout = getLayout(layoutName);
  const config = await getLayoutConfigFromQuery(layoutName, query);

  return { config, layout };
};
