import "./HomeBar.css";

const HomeBar = () => {
  return (
    <div className="homeBar">
      <img
        src="Images/BirmanBankLogo/BirmanIcon.png"
        alt="BirmanIconWithText"
      />
      <div className="title">BIRMAN BANKING</div>
      <div className="register-buttons">
        <a href="/Login" className="register-button">
          <button>Login</button>
        </a>
        <a href="/register" className="register-button">
          <button>Sign Up</button>
        </a>
      </div>
    </div>
  );
};

export default HomeBar;