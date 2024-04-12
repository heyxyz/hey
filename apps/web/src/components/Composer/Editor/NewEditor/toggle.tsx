import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export default function Toggle({
  as,
  children,
  disabled,
  onClick,
  pressed
}: {
  as?: ElementType<HTMLAttributes<HTMLElement>>;
  children: ReactNode;
  disabled?: boolean;
  onClick?: VoidFunction;
  pressed: boolean;
}) {
  const Component = as ?? 'button';
  return (
    <Component
      className="outline-unset focus-visible:outline-unset inline-flex items-center justify-center rounded-md bg-transparent p-2 font-medium transition hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-900 disabled:pointer-events-none disabled:opacity-50 hover:disabled:opacity-50 data-[state=on]:bg-gray-200/60 dark:hover:bg-zinc-800 dark:focus-visible:ring-zinc-300 dark:data-[state=on]:bg-gray-700/60"
      data-state={pressed ? 'on' : 'off'}
      disabled={disabled}
      onClick={() => onClick?.()}
      onMouseDown={(event) => event.preventDefault()}
    >
      {children}
    </Component>
  );
}
