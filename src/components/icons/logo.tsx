import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 20"
      className="h-6 w-auto"
      {...props}
    >
      <text
        x="0"
        y="15"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        fontWeight="bold"
        fill="currentColor"
      >
        Yabily
      </text>
    </svg>
  );
}
