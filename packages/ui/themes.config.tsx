import type { HTMLProps } from 'react';

const ThemeConfig = {
  logo: <span>My Nextra Documentation</span>,
  project: {
    link: 'https://github.com/shuding/nextra'
  },
  components: {
    Container: ({ children }: HTMLProps<HTMLDivElement>) => {
      return <div className="my-4 flex justify-around rounded-md border border-gray-500 p-6">{children}</div>;
    }
  }
};

export default ThemeConfig;
