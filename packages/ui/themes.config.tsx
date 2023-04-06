import type { HTMLProps } from 'react';

const ThemeConfig = {
  logo: <span>Lenster UI design</span>,
  project: {
    link: 'https://github.com/lensterxyz/lenster'
  },
  components: {
    Container: ({ children }: HTMLProps<HTMLDivElement>) => {
      return <div className="my-4 flex justify-around rounded-md border border-gray-500 p-6">{children}</div>;
    }
  }
};

export default ThemeConfig;
