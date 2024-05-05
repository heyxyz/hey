import type { SVGProps } from 'react';

export const BoldIcon = (props: SVGProps<SVGSVGElement>) => {
  // Lucide Icon
  // License: ISC
  // https://lucide.dev/license
  return (
    <svg
      height="1em"
      viewBox="0 0 24 24"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14 12a4 4 0 0 0 0-8H6v8m9 8a4 4 0 0 0 0-8H6v8Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export const ItalicIcon = (props: SVGProps<SVGSVGElement>) => {
  // Lucide Icon
  // License: ISC
  // https://lucide.dev/license
  return (
    <svg
      height="1em"
      viewBox="0 0 24 24"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19 4h-9m4 16H5M15 4L9 20"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};
