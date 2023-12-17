import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';

import { useState } from 'react';
interface Option {
  description: ReactNode;
  key: string;
  title: ReactNode;
  value: string;
}

interface SelectMenuProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  options: Option[];
}

const SelectMenu: FC<SelectMenuProps> = ({ options, ...buttonProps }) => {
  const [selectedOption, setSelectedOption] = useState<null | Option>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div>
      <label
        className="block text-sm font-medium leading-6 text-gray-900"
        id="listbox-label"
      >
        Assigned to
      </label>
      <div className="relative mt-2">
        <button
          {...buttonProps}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby="listbox-label"
          className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          {selectedOption ? (
            <span className="flex items-center">
              <img
                alt=""
                className="h-5 w-5 flex-shrink-0 rounded-full"
                src={selectedOption.value}
              />
              <span className="ml-3 block truncate">
                {selectedOption.title}
              </span>
            </span>
          ) : (
            <span>Select an option</span>
          )}
          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            <svg
              aria-hidden="true"
              className="h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clipRule="evenodd"
                d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                fillRule="evenodd"
              />
            </svg>
          </span>
        </button>

        {isOpen && (
          <ul
            aria-labelledby="listbox-label"
            className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            role="listbox"
            tabIndex={-1}
          >
            {options.map((option) => (
              <li
                className={`${
                  selectedOption === option
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-900'
                } relative cursor-default select-none py-2 pl-3 pr-9`}
                id={`listbox-option-${option.key}`}
                key={option.key}
                onClick={() => handleOptionClick(option)}
                role="option"
              >
                <div className="flex items-center">
                  <img
                    alt=""
                    className="h-5 w-5 flex-shrink-0 rounded-full"
                    src={option.value}
                  />
                  <span
                    className={`font-${
                      selectedOption === option ? 'semibold' : 'normal'
                    } ml-3 block truncate`}
                  >
                    {option.title}
                  </span>
                </div>

                {selectedOption === option && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-white">
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        clipRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SelectMenu;
