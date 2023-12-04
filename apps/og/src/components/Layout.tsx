import React from 'react';
import 'twin.macro';

import type { ILayout, ILayoutProperty } from '../layouts/types';

import { useLayoutConfig } from '../hooks/useLayoutConfig';
import { Field, Label } from './Field';
import { Input } from './Input';
import { PopoverColorPicker } from './PopoverColorPicker';
import { Select } from './Select';

export interface Props {
  layout: ILayout;
}

export const LayoutProperty: React.FC<{
  property: ILayoutProperty;
}> = ({ property: p }) => {
  const [layoutConfig, setLayoutConfig] = useLayoutConfig();

  return (
    <Field>
      <Label>{p.name} </Label>

      <div tw="w-full">
        {p.type === 'text' ? (
          <Input
            onChange={(e) => setLayoutConfig({ [p.name]: e.target.value })}
            placeholder={p.placeholder ?? `Value for ${p.name}`}
            value={layoutConfig[p.name] ?? ''}
          />
        ) : p.type === 'number' ? (
          <Input
            onChange={(e) => setLayoutConfig({ [p.name]: e.target.value })}
            placeholder={p.placeholder ?? `Value for ${p.name}`}
            type="number"
            value={layoutConfig[p.name] ?? ''}
          />
        ) : p.type === 'select' ? (
          <Select
            onChange={(value) => setLayoutConfig({ [p.name]: value })}
            options={p.options.map((value) => ({ value }))}
            value={layoutConfig[p.name] ?? ''}
          />
        ) : p.type === 'color' ? (
          <PopoverColorPicker
            color={layoutConfig[p.name] ?? p.default}
            onChange={(value) => setLayoutConfig({ [p.name]: value })}
          />
        ) : null}

        {/* {p.description != null && (
          <span tw="text-xs text-gray-400">{p.description}</span>
        )} */}
      </div>
    </Field>
  );
};

export const Layout: React.FC<Props> = ({ layout }) => {
  return (
    <div className={`layout-${layout.name}`} tw="space-y-4">
      {layout.properties.map((p) => (
        // @ts-ignore
        <LayoutProperty key={p.name} property={p} />
      ))}
    </div>
  );
};
