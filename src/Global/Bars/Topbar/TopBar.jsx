import "./TopBar.css";
import Hamburger from "../../../Icons/Hamburger/Hamburger";

const Topbar = ({ setSidebarCollapsed }) => {
  return (
    <div className="topbar">
      <button
        className="sb-button"
        onClick={() => setSidebarCollapsed((prev) => !prev)}
      >
        <Hamburger />
      </button>
      <div className="title">BIRMAN BANKING</div>
    </div>
  );
};

export default Topbar;
