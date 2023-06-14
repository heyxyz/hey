import {
  getCurrentActiveRounds,
  getRoundInfo
} from '@components/Publication/Actions/Tip/QuadraticQueries/grantsQueries';
import { Menu } from '@headlessui/react';
import type { Dispatch, SetStateAction } from 'react';
import React, { useEffect, useState } from 'react';

interface SelectQuadraticRoundMenuProps {
  setSelectedQuadraticRound: Dispatch<SetStateAction<string>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const SelectQuadraticRoundMenu = ({
  setSelectedQuadraticRound,
  setShowModal
}: SelectQuadraticRoundMenuProps) => {
  const [roundArray, setRoundArray] = useState<{ name: string; id: string }[]>();

  useEffect(() => {
    async function getActiveRounds() {
      const now = Math.floor(Date.now() / 1000);

      const rounds = await getCurrentActiveRounds(now);

      for (const round of rounds) {
        const roundDetails = await getRoundInfo(round.id);
        const name = '';

        setRoundArray((roundArray) => {
          const newArray = roundArray ?? [];

          if (!newArray.find((r) => r.id === round.id)) {
            return [...newArray, { name: name, id: round.id }];
          }

          return newArray;
        });
      }
    }
    getActiveRounds();
  }, []);

  return (
    <Menu as="div" className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center">
        <Menu.Button className="mx-auto rounded border-2 border-purple-500 px-4 py-2 text-sm font-medium text-purple-500 hover:bg-purple-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          select a quadratic round!
        </Menu.Button>
      </div>
      <div className="relative flex items-center justify-center">
        <Menu.Items className="mt-2 origin-top divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          {roundArray &&
            roundArray.map((round) => (
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
                    <div className="flex flex-col">
                      <div className="flex justify-center">{round.name}</div>
                      <div> {round.id}</div>
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
