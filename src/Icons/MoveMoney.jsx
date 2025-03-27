import React from 'react';

const MoveMoney = ({ size = 24, color = 'currentColor', ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="15 18 22 12 15 6" />
      <polyline points="9 18 2 12 9 6" />
      <path d="M22 12h-20" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="12" r="3" />
    </svg>
  );
};

export default MoveMoney;