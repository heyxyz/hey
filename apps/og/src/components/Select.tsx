import React from 'react';
import { ChevronDown } from 'react-feather';
import tw from 'twin.macro';

export interface Option {
  disabled?: boolean;
  text?: string;
  value: string;
}

export interface Props {
  autoFocus?: boolean;
  disabled?: boolean;
  error?: boolean;
  name?: string;
  onChange?: (value: string) => void;
  options: Option[];
  value?: string;
  width?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, Props>(
  (
    { autoFocus, disabled, error, name, onChange, options, value, ...rest },
    forwardedRef
  ) => {
    return (
      <div
        css={[
          tw`relative flex items-center w-full`,
          disabled && tw`opacity-60`
        ]}
      >
        <select
          autoFocus={autoFocus}
          className="select"
          css={[
            tw`bg-transparent w-full h-9 appearance-none border rounded`,
            tw`py-1 pl-3 pr-8`,
            !disabled && tw`cursor-pointer hover:border-gray-400`,
            error
              ? tw`border-red-500 hover:border-red-500`
              : tw`border-gray-200`,
            tw`focus:outline-none focus:border-transparent focus-visible:ring-2 focus-visible:ring-accent`
          ]}
          disabled={disabled}
          name={name}
          ref={forwardedRef}
          value={value}
          {...rest}
          onChange={(e) => {
            if (onChange != null) {
              onChange(e.target.value);
            }
          }}
        >
          {options.map((opt) => (
            <option
              disabled={opt.disabled}
              key={opt.value}
              tw="text-fg"
              value={opt.value}
            >
              {opt.text ?? opt.value}
            </option>
          ))}
        </select>

        <ChevronDown tw="h-full absolute top-0 right-2 pointer-events-none" />
      </div>
    );
  }
);

Select.displayName = 'Select';
