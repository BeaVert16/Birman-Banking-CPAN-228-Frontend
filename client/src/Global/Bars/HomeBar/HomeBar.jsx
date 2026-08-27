import "./HomeBar.css";
import { IsLoggedInContext } from "../../../auth/IsLoggedInCheck";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../Images/BirmanBankLogo/BirmanIcon.png";
const HomeBar = () => {
  const { logout, isAuthenticated, user } = useContext(IsLoggedInContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAccountClick = () => {
    if (user?.role === "ADMIN") {
      navigate("/admin-dashboard/clients");
    } else {
      navigate("/account");
    }
  };

  return (
    <div className="homeBar">
      <img
        src={Logo}
        alt="BirmanIconWithText"
      />
      <div className="title">BIRMAN BANKING</div>
      <div className="register-buttons">
        {/* If not logged-in. */}
        {!isAuthenticated && (
          <>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
          </>
        )}
        {/* If logged-in. */}
        {isAuthenticated && (
          <>
            <button onClick={handleAccountClick}>Account</button>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeBar;