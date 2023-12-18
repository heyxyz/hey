import type { ComponentProps, ReactNode } from 'react';

import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { forwardRef, Fragment, useState } from 'react';

import cn from '../cn';

type OptionEvent = {
  target: {
    value: string;
  };
};

type Option = {
  description?: ReactNode;
  disabled?: boolean;
  key?: string;
  label?: string;
  selected?: boolean;
  title?: ReactNode;
  value?: string;
};
interface SelectProps extends ComponentProps<'select'> {
  className?: string;
  defaultValue?: string;
  label?: string;
  onChange?: (value: OptionEvent) => void;
  options?: Option[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { className = '', defaultValue, label, onChange, options, ...rest },
    ref
  ) {
    const [selected, setSelected] = useState(
      options?.find(
        (option) => option.value === defaultValue || option.selected
      ) || options?.[0]
    );

    return (
      <Listbox
        onChange={(e: Option) => {
          setSelected(e);
          onChange?.({
            target: {
              value: e.value as string
            }
          });
        }}
        ref={ref}
        value={selected}
      >
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
              {label || 'Select an option'}
            </Listbox.Label>
            <div className="relative mt-2">
              <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                <span className="ml-3 block truncate">
                  {selected?.title || selected?.label}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                  <ChevronUpDownIcon
                    aria-hidden="true"
                    className="h-5 w-5 text-gray-400"
                  />
                </span>
              </Listbox.Button>

              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                show={open}
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {options?.map((option) => (
                    <Listbox.Option
                      className={({ active }) =>
                        cn(
                          'relative cursor-default select-none py-0.5 pl-3 pr-9',
                          active ? 'bg-[#Fa4669] text-white' : 'text-gray-900'
                        )
                      }
                      key={option.key}
                      value={option}
                    >
                      {/* eslint-disable-next-line perfectionist/sort-objects */}
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span
                              className={cn(
                                'ml-3 block truncate',
                                selected ? 'font-semibold' : 'font-normal'
                              )}
                            >
                              {option?.title || option?.label}
                            </span>
                            {option?.description && (
                              <span
                                className={cn(
                                  'ml-1 block truncate font-thin text-gray-500',
                                  selected ? 'font-semibold' : 'font-normal'
                                )}
                              >
                                {option.description}
                              </span>
                            )}
                          </div>

                          {selected ? (
                            <span
                              className={cn(
                                'absolute inset-y-0 right-0 flex items-center pr-4',
                                active ? 'text-white' : 'text-[#Fa4669]'
                              )}
                            >
                              <CheckIcon
                                aria-hidden="true"
                                className="h-5 w-5"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    );
  }
);
