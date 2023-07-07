import type { QuadraticRound } from '@components/Composer/NewPublication';
import { Menu } from '@headlessui/react';
import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import { useNetwork } from 'wagmi';

interface SelectQuadraticRoundMenuProps {
  setSelectedQuadraticRound: Dispatch<SetStateAction<QuadraticRound>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  activeRounds: QuadraticRound[];
  setManuallySelectedRound: Dispatch<SetStateAction<string>>;
}

const SelectQuadraticRoundMenu = ({
  setSelectedQuadraticRound,
  setShowModal,
  activeRounds,
  setManuallySelectedRound
}: SelectQuadraticRoundMenuProps) => {
  const { chain } = useNetwork();

  const polygonScanLink = (address: string, type: string) => {
    let url;
    if (chain) {
      switch (chain.id) {
        case 80001:
          if (type === 'address') {
            url = `https://mumbai.polygonscan.com/address/${address}`;
          } else {
            url = `https://mumbai.polygonscan.com/token/${address}`;
          }
          break;
        case 137:
          if (type === 'address') {
            url = `https://polygonscan.com/address/${address}`;
          } else {
            url = `https://polygonscan.com/token/${address}`;
          }
          break;
      }
    }
    return url;
  };

  const getTokenName = (address: string) => {
    let name;
    if (chain) {
      switch (chain.id) {
        case 80001:
          if (address == '0x9c3c9283d3e44854697cd22d3faa240cfb032889') {
            name = 'WMATIC';
          }
          break;
        case 137:
          if (address == '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270') {
            name = 'WMATIC';
          }
          break;
        default:
          name = 'View on block explorer';
          break;
      }
      return name;
    }
  };

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
                    } group my-1 flex w-full items-center justify-center rounded-md text-sm hover:bg-purple-500`}
                    href="#"
                    onClick={() => {
                      setSelectedQuadraticRound(round);
                      setManuallySelectedRound(round.id);
                      setShowModal(false);
                    }}
                  >
                    <div className="flex flex-col items-center rounded-lg bg-purple-500 p-5 shadow-md transition-colors duration-200 hover:bg-purple-700">
                      <div className="mb-3 text-center text-lg font-bold text-white">{round.name}</div>
                      <div className="w-full rounded-lg bg-white p-3 text-left shadow-md">
                        <div className="mb-2 text-sm italic text-gray-600">{round.description}</div>
                        <div className="mt-2 text-sm">
                          <span className="font-semibold text-gray-800">Round Address: </span>
                          <span className="text-gray-600">{round.id}</span>
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="font-semibold text-gray-800">Rounds Ends: </span>
                          <span className="text-gray-600">{round.endTime.toLocaleString()}</span>
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="font-semibold text-gray-800">Token: </span>
                          <span className="text-gray-600">{getTokenName(round.token)}</span>
                        </div>
                        {round.requirements && round.requirements[0] !== '' && (
                          <div className="mt-2">
                            <div className="text-sm">
                              <span className="font-semibold text-gray-800">
                                Required text in order to join round:{' '}
                              </span>
                              <span className="text-gray-600">{round.requirements.join(', ')}</span>
                            </div>
                          </div>
                        )}
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
