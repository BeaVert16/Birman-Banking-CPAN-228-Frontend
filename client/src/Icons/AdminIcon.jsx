const AdminIcon = ({ size = 32, color = "black" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Shield outline */}
    <path
      d="M32 4 L12 12 V28 C12 44 24 56 32 60 C40 56 52 44 52 28 V12 L32 4 Z"
      stroke={color}
      strokeWidth="4"
      fill="white"
    />

    {/* Star in the center */}
    <path
      d="M32 22 L34.5 28 H41 L36 32 L38 38 L32 34 L26 38 L28 32 L23 28 H29.5 L32 22 Z"
      fill={color}
    />
  </svg>
);

export default AdminIcon;
