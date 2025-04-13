import "./TopBar.css";
import Hamburger from "../../../Icons/Hamburger/Hamburger";

const Topbar = ({ setSidebarCollapsed }) => {  
  const handleLogout = () => {
    logout();
    navigate("/login");
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