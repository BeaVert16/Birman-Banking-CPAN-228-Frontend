const Hamburger = () => {
  const menuStyle = {
    display: 'inline-block',
    cursor: 'pointer',
    width: '30px',
    height: '22px',
  };

  const barStyle = {
    width: '100%',
    height: '4px',
    backgroundColor: '#333',
    margin: '4px 0',
    transition: '0.4s',
  };

  return (
    <div style={menuStyle}>
      <div style={barStyle}></div>
      <div style={barStyle}></div>
      <div style={barStyle}></div>
    </div>
  );
};

export default Hamburger;
