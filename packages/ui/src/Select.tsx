import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition
} from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { Fragment, forwardRef, useState } from "react";

import cn from "../cn";
import { Input } from "./Input";

interface SelectProps {
  className?: string;
  defaultValue?: string;
  iconClassName?: string;
  onChange: (value: any) => any;
  options?: {
    disabled?: boolean;
    helper?: string;
    icon?: string;
    label: string;
    selected?: boolean;
    value: number | string;
  }[];
  showSearch?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({
    className,
    defaultValue,
    iconClassName,
    onChange,
    options,
    showSearch = false
  }) {
    const [searchValue, setSearchValue] = useState("");
    const selected = options?.find((option) => option.selected) || options?.[0];

    return (
      <Listbox onChange={onChange} value={defaultValue || selected?.value}>
        <div className="relative">
          <ListboxButton
            className={cn(
              "flex w-full items-center justify-between space-x-3 rounded-xl border border-gray-300 bg-white px-3 py-2 text-left outline-none focus:border-gray-500 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-800",
              className
            )}
          >
            <span className="flex items-center space-x-2">
              {selected?.icon && (
                <img
                  className={iconClassName}
                  src={selected?.icon}
                  alt={selected?.label}
                />
              )}
              <span>{selected?.label}</span>
            </span>
            <ChevronDownIcon className="mr-1 size-5 text-gray-400" />
          </ListboxButton>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <ListboxOptions className="no-scrollbar absolute z-[5] mt-2 max-h-60 w-full overflow-auto rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900">
              {showSearch ? (
                <div className="mx-4 mt-4">
                  <Input
                    className="w-full"
                    iconLeft={<MagnifyingGlassIcon />}
                    onChange={(event) => {
                      setSearchValue(event.target.value);
                    }}
                    placeholder="Search"
                    type="text"
                    value={searchValue}
                  />
                </div>
              ) : null}
              {options
                ?.filter((option) =>
                  option.label.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((option, id) => (
                  <ListboxOption
                    className={({ focus }: { focus: boolean }) =>
                      cn(
                        { "dropdown-active": focus },
                        "m-2 cursor-pointer rounded-lg"
                      )
                    }
                    disabled={option.disabled}
                    key={id}
                    value={option.value}
                  >
                    {({ selected }) => (
                      <div className="mx-2 flex flex-col space-y-0 py-1.5">
                        <span className="flex w-full items-center justify-between space-x-3 text-gray-700 dark:text-gray-200">
                          <span className="flex items-center space-x-2">
                            {option.icon && (
                              <img
                                className={iconClassName}
                                src={option.icon}
                                alt={option.label}
                              />
                            )}
                            <span className="block truncate">
                              {option.label}
                            </span>
                          </span>
                          {selected ? (
                            <CheckCircleIcon className="size-5" />
                          ) : null}
                        </span>
                        {option.helper ? (
                          <span className="ld-text-gray-500 text-xs">
                            {option.helper}
                          </span>
                        ) : null}
                      </div>
                    )}
                  </ListboxOption>
                ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    );
  }
);
