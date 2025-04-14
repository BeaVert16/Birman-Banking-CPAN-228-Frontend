const TransactionIcon = ({ size = 32, color = "black" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circular background */}
      <circle cx="32" cy="32" r="28" stroke={color} strokeWidth="4" />
      
      {/* Left-pointing arrow */}
      <path
        d="M40 24 L28 24 M28 24 L32 20 M28 24 L32 28"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Right-pointing arrow */}
      <path
        d="M24 40 L36 40 M36 40 L32 36 M36 40 L32 44"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  
  export default TransactionIcon;