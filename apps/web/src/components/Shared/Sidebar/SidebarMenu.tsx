import type { FC } from "react";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Card } from "@hey/ui";
import cn from "@hey/ui/cn";
import { useRouter } from "next/router";
import { useState } from "react";

import type { SidebarProps } from ".";

import MenuTransition from "../MenuTransition";
import { NextLink } from "../Navbar/MenuItems";

const SidebarMenu: FC<SidebarProps> = ({ items }) => {
  const { pathname } = useRouter();
  const menuItems = items.filter((item) => item?.enabled !== false);
  const [selectedItem, setSelectedItem] = useState(
    menuItems.find((item) => item.url === pathname) || menuItems[0]
  );

  return (
    <div className="mb-4 space-y-2">
      <Menu as="div" className="relative">
        {({ open }) => (
          <>
            <MenuButton
              className={cn(
                "flex w-full items-center space-x-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-left outline-none focus:border-gray-500 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-800",
                {
                  "bg-gray-200 text-black dark:bg-gray-800 dark:text-white":
                    open,
                  "text-gray-700 hover:bg-gray-200 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white":
                    !open
                }
              )}
            >
              {selectedItem.icon}
              <div>{selectedItem.title}</div>
            </MenuButton>
            <MenuTransition>
              <MenuItems className="absolute z-10 mt-2 w-full" static>
                <Card forceRounded>
                  {menuItems.map((item) => (
                    <MenuItem
                      as={NextLink}
                      className={({ focus }: { focus: boolean }) =>
                        cn(
                          {
                            "dropdown-active": focus || selectedItem === item
                          },
                          "m-2 flex items-center space-x-2 rounded-lg p-2"
                        )
                      }
                      href={item.url}
                      key={item.url}
                      onClick={() => setSelectedItem(item)}
                    >
                      {item.icon}
                      <div>{item.title}</div>
                    </MenuItem>
                  ))}
                </Card>
              </MenuItems>
            </MenuTransition>
          </>
        )}
      </Menu>
    </div>
  );
};

export default SidebarMenu;
