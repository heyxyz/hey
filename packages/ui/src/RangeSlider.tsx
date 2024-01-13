import * as SliderPrimitive from '@radix-ui/react-slider';
import { forwardRef } from 'react';

import cn from '../cn';

interface RangeSliderProps extends SliderPrimitive.SliderProps {
  className?: string;
  displayValue?: string;
}

export const RangeSlider = forwardRef<HTMLInputElement, RangeSliderProps>(
  function RangeSlider({ className = '', displayValue, ...rest }, ref) {
    return (
      <SliderPrimitive.Root
        className={cn(
          'relative flex h-5 w-full touch-none select-none items-center',
          className
        )}
        max={100}
        ref={ref}
        step={1}
        {...rest}
      >
        <SliderPrimitive.Track className="dark:bg-brand-800 bg-brand-200 relative h-1.5 grow rounded-full">
          <SliderPrimitive.Range className="bg-brand-600 absolute h-full rounded-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          aria-label="Slider"
          className="bg-brand-500 block rounded-lg px-2 py-1 text-xs font-bold text-white focus:outline-none active:scale-110"
        >
          {displayValue || rest.value}
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
    );
  }
);
