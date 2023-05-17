import React from 'react';
import { Image } from 'ui';

type PropsOf<T> = T extends React.ComponentType<infer P> ? P : never;

const ModifiedImage = <T extends React.ComponentType<any>>(WrappedComponent: T) => {
  type Props = PropsOf<T>;

  return function ModifiedImage(props: Props) {
    return (
      <div className="relative min-w-max">
        <div className="radius absolute bottom-[-7px] right-[-7px] flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#DCDCDF]">
          <Image alt="deprecated icon" src="/push/deprecated.svg" className="h-4 w-4" />
        </div>

        <WrappedComponent {...props} />
      </div>
    );
  };
};

export default ModifiedImage;
