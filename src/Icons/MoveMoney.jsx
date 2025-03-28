import React from 'react';

const MoveMoney = (props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Move Money Icon</title>
      
      {/* Bigger circle outline representing money */}
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" fill="none" />

      {/* Dollar sign inside the circle */}
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fill="currentColor"
        fontSize="12"
        fontFamily="Arial"
      >
        $
      </text>

      {/* Horizontal line with an arrow to indicate movement */}
      <path 
        d="M16 12H22" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path 
        d="M19 9L22 12L19 15" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export default MoveMoney;
