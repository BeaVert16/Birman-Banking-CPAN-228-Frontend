import "./TopBar.css";
import Hamburger from "../../../Icons/Hamburger/Hamburger";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { IsLoggedInContext } from "../../../auth/IsLoggedInCheck";

const Topbar = ({ setSidebarCollapsed }) => {
  const navigate = useNavigate();
  const { logout } = useContext(IsLoggedInContext); // Use useContext to access the context

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="topbar">
      <button
        className="sb-button"
        onClick={() => setSidebarCollapsed((prev) => !prev)}
      >
        <Hamburger />
      </button>
      <div className="title">BIRMAN BANKING</div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Topbar;