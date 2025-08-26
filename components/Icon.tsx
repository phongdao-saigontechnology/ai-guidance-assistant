
import React from 'react';

type IconProps = {
  name: 'microphone' | 'send' | 'back' | 'chevron-right' | 'robot' | 'user' | 'close' | 'list' | 'chat';
  className?: string;
};

const iconPaths: Record<IconProps['name'], React.ReactNode> = {
  microphone: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
    />
  ),
  send: <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />,
  back: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />,
  'chevron-right': <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />,
  robot: (
    <>
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M9 16H8" />
      <path d="M16 16h-1" />
    </>
  ),
  user: <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />,
  close: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
  list: <path d="M8 6h10M6 12h12M4 18h14" />,
  chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
};

const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
  >
    {name === 'microphone' ? (
      <>
        {iconPaths.microphone}
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </>
    ) : name === 'user' ? (
       <>
        {iconPaths.user}
        <circle cx="12" cy="7" r="4" />
       </>
    ) : (
      iconPaths[name]
    )}
  </svg>
);

export default Icon;
