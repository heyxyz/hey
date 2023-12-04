import type { z } from 'zod';

export type FileType = 'png' | 'svg';

export interface IConfig {
  fileType?: FileType;
  layoutName: string;
}

export type ILayoutProperty = { name: string } & (
  | {
      default?: string;
      options: string[];
      type: 'select';
    }
  | {
      default?: string;
      placeholder?: string;
      type: 'number';
    }
  | {
      default?: string;
      placeholder?: string;
      type: 'text';
    }
  | {
      default?: string;
      type: 'color';
    }
);

export type LayoutComponent<TConfig> = React.ComponentType<{
  config: TConfig;
}>;

export type ILayout<TConfig extends z.ZodType = z.AnyZodObject> = {
  Component: LayoutComponent<z.infer<TConfig>>;
  config: TConfig;
  name: string;
  properties: ILayoutProperty[];
};

export type ILayoutValue = string;
export type ILayoutConfig = Record<string, ILayoutValue>;
