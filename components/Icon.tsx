
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: 'arrowLeft' | 'reply' | 'heart' | 'bold' | 'italic' | 'link';
}

const icons: Record<IconProps['name'], React.ReactNode> = {
  arrowLeft: <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />,
  reply: <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6-6m-6 6l6 6" />,
  heart: <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
  bold: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-4-8h8m-8-4h7a4 4 0 010 8h-7" />,
  italic: <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h10M7 20h10M11 4l-4 16" />,
  link: <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />,
};

export const Icon: React.FC<IconProps> = ({ name, className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      {icons[name]}
    </svg>
  );
};
