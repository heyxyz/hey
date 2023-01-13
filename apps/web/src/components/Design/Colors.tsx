import type { FC } from 'react';
import type { ThemeConfig } from 'tailwindcss/types/config.js';

import * as a from '../../../tailwind.config.js';

type Color = { name: string; color: string };
type Gradient = { name: string; colors: Color[] };
type Swatch = Gradient[];

const themeToSwatch = (theme: ThemeConfig): Swatch => {
  const colors = theme?.colors as Record<string, any>;
  const swatch: Swatch = Object.entries(colors)
    .map(([color, keys]) => {
      if (color === 'extend') {
        return null;
      }

      return {
        name: color,
        colors: Object.entries(keys).map(([key, value]) => ({
          name: key,
          color: value
        }))
      };
    })
    .filter(Boolean) as Swatch;
  return swatch;
};

const ColorSquare = ({ name, color }: Color) => {
  return (
    <div className="overflow-hidden rounded-xl shadow-md">
      <div className="py-6 w-full" style={{ backgroundColor: color }} />
      <div className="px-3 py-2">
        <div className="font-medium text-sm">{name}</div>
        <div className="font-mono text-xs text-gray-500">{color}</div>
      </div>
    </div>
  );
};

const ColorGradient = ({ gradient }: { gradient: Gradient }) => {
  if (gradient.colors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="font-bold">{gradient.name}</div>
      <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-6">
        {gradient.colors.map(({ name, color }) => (
          <ColorSquare key={name} name={name} color={color} />
        ))}
      </div>
    </div>
  );
};

const Colors: FC = () => {
  if (!a.theme.extend) {
    return null;
  }

  const swatch = themeToSwatch(a.theme.extend as any);

  return (
    <div className="space-y-3">
      <div className="text-xl font-bold">Colors</div>
      <div className="space-y-5">
        {swatch.map((gradient) => (
          <ColorGradient key={gradient.name} gradient={gradient} />
        ))}
      </div>
    </div>
  );
};

export default Colors;
