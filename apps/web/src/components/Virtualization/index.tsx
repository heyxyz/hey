import type { FC, ReactNode } from 'react';
import type { AutoSizerProps, WindowScrollerProps } from 'react-virtualized';
import { AutoSizer as _AutoSizer, WindowScroller as _WindowScroller } from 'react-virtualized';

interface WindowVirtualized {
  children: ReactNode;
}

const Virtualized: FC<WindowVirtualized> = ({ children }) => {
  const AutoSizer = _AutoSizer as unknown as FC<AutoSizerProps>;
  const WindowScroller = _WindowScroller as unknown as FC<WindowScrollerProps>;

  return (
    <WindowScroller>
      {({ height }) => (
        <AutoSizer disableHeight disableWidth>
          {({ width }) => <div style={{ height: height, width: width }}>{children}</div>}
        </AutoSizer>
      )}
    </WindowScroller>
  );
};

export default Virtualized;
