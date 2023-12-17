import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';

import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useState } from 'react';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

interface Option {
  description: ReactNode;
  key: string;
  title: ReactNode;
  value: string;
}

interface SelectMenuProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  options: Option[];
}

const SelectMenu: FC<SelectMenuProps> = ({
  options,
  ...buttonProps
}: SelectMenuProps) => {
  const [selected, setSelected] = useState<null | Option>(options[0]);

  return (
    <Listbox onChange={setSelected} value={selected}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
            Assigned to
          </Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button
              {...buttonProps}
              className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
            >
              <span className="flex items-center">
                <img
                  alt=""
                  className="h-5 w-5 flex-shrink-0 rounded-full"
                  src={selected?.value}
                />
                <span className="ml-3 block truncate">{selected?.title}</span>
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
                {options.map((option) => (
                  <Listbox.Option
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    key={option.key}
                    value={option}
                  >
                    {({ active, selected }) => (
                      <>
                        <div className="flex items-center">
                          <img
                            alt=""
                            className="h-5 w-5 flex-shrink-0 rounded-full"
                            src={option.value}
                          />
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'ml-3 block truncate'
                            )}
                          >
                            {option.title}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon aria-hidden="true" className="h-5 w-5" />
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
};

export default SelectMenu;
