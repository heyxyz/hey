import { Menu } from '@headlessui/react';
import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import type { QuadraticRound } from '@components/Composer/NewPublication';

interface SelectQuadraticRoundMenuProps {
  setSelectedQuadraticRound: Dispatch<SetStateAction<string>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  activeRounds: QuadraticRound[];
}

const SelectQuadraticRoundMenu = ({
  setSelectedQuadraticRound,
  setShowModal,
  activeRounds
}: SelectQuadraticRoundMenuProps) => {
  return (
    <Menu as="div" className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center">
        <Menu.Button className="mx-auto rounded border-2 border-purple-500 px-4 py-2 text-sm font-medium text-purple-500 hover:bg-purple-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          select a quadratic round!
        </Menu.Button>
      </div>
      <div className="relative flex items-center justify-center">
        <Menu.Items className="mt-2 origin-top divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          {activeRounds &&
            activeRounds.map((round: QuadraticRound) => (
              <Menu.Item key={round.id}>
                {({ active }) => (
                  <a
                    className={`${
                      active ? 'bg-white text-white' : 'text-purple-500'
                    } group my-1 flex w-full items-center justify-center rounded-md bg-purple-300 px-2 py-2 text-sm hover:bg-purple-500`}
                    href="#"
                    onClick={() => {
                      setSelectedQuadraticRound(round.id);
                      setShowModal(false);
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-center text-lg font-bold">{round.name}</div>
                      <div className="w-full text-left">
                        <div className="text-sm italic text-gray-600">{round.description}</div>
                        <div className="mt-2 text-sm">
                          <span>Round Address: </span>
                          <span className="text-xs">{round.id}</span>
                        </div>
                        <div className="text-sm">
                          <span>End Time: </span>
                          <span className="text-xs">{round.endTime.toLocaleString()}</span>
                        </div>
                        <div className="text-sm">
                          <span>Token: </span>
                          <span className="text-xs">{round.token}</span>
                        </div>
                        <div className="mt-1 text-sm">
                          <span>Required text in order to join round: </span>
                          <span className="text-xs">{round.requirements.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                )}
              </Menu.Item>
            ))}
        </Menu.Items>
      </div>
    </Menu>
  );
};

export default SelectQuadraticRoundMenu;
