import React, { forwardRef, useId, Fragment, useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import cn from '../cn';
interface SelectOption {
  disabled?: boolean;
  label: string;
  selected?: boolean;
  value: number | string;
}
interface SelectProps extends Omit<ComponentProps<'select'>, 'options'> {
  className?: string;
  title?: string;
  description?: ReactNode;
  options?: SelectOption[];
  key?: string;
  value?: string;
  label: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className = "", label, options, title, description, ...rest }, ref) {
    const [selected, setSelected] = useState(
      options?.find((option) => option.selected) || options?.[0]
    );
    const id = useId();

    return (
      <div className="relative mt-1">
        {title && <div className="title">{title}</div>}
        {description && <div className="description">{description}</div>}
        <Listbox value={selected} onChange={(value) => setSelected(value)}>
          <Listbox.Button className={cn('relative w-full cursor-default rounded-md bg-white py-1 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#Fa4669] sm:text-sm sm:leading-6')}>
            <span className="block truncate">{selected?.label ?? ''}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
            </span>
          </Listbox.Button>
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {options?.map((option, index) => (
                <Listbox.Option key={index}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-1 pl-10 pr-4 ${ active ? 'bg-[#Fa4669] text-white' : 'text-gray-900'}`} value={option}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${ selected ? 'font-medium' : 'font-normal'}`}> {option.label} </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#Fa4669]">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </Listbox>
      </div>
    );
  }
);