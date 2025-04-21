import "./HomeBar.css";
import { IsLoggedInContext } from "../../../auth/IsLoggedInCheck";
import { useContext } from "react";

const HomeBar = () => {
  const { logout, isAuthenticated  } = useContext(IsLoggedInContext);

  return (
    <div className="homeBar">
      <img
        src="src/Images/BirmanBankLogo/BirmanIcon.png"
        alt="BirmanIconWithText"
      />
      <div className="title">BIRMAN BANKING</div>
      <div className="register-buttons">

        {/* If not logged-in. */}
        {!isAuthenticated && (
          <>
            <a href="/Login" className="register-button">
              <button>Login</button>
            </a>
            <a href="/register" className="register-button">
              <button>Register</button>
            </a>
          </>
        )}
        {/* If logged-in. */}
        {isAuthenticated && (
          <>
            <a href="/account" className="register-button">
              <button>Account</button>
            </a>
            <a href="/" className="register-button">
              <button onClick={logout}>Logout</button>
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeBar;