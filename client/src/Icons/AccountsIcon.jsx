const AccountsIcon = ({ size = 32, color = "black" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="white"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Folder base */}
    <rect
      x="8"
      y="20"
      width="48"
      height="32"
      rx="4"
      stroke={color}
      strokeWidth="4"
      fill="white"
    />

    {/* Folder tab */}
    <rect
      x="16"
      y="12"
      width="20"
      height="8"
      rx="2"
      stroke={color}
      strokeWidth="4"
      fill="none"
    />
  </svg>
);

export default AccountsIcon;
