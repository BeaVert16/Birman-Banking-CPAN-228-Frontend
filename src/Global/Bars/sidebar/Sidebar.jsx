import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useState } from "react";
import { Link } from "react-router-dom";

import "./Sidebar.css";

//----------Icon Imports----------//
import Home from "../../../Icons/Home";
import MoveMoney from "../../../Icons/MoveMoney";
import DBI from "../../../Icons/DashBoard";
import ComputerIcon from "../../../Icons/ComputerIcon";
import GitHubIcon from "../../../Icons/GitHubIcon";

const Bar = ({ collapsed }) => {
  const [isDashboardActive, setIsDashboardActive] = useState(false);

  return (
    <div className="sidebar-container">
      <div className="content">
        <Sidebar collapsed={collapsed}>
          <Menu>
            <Link to="/" className="plain-link">
              <div className="logo-container">
                <img
                  className="logo"
                  src="Images/BirmanBankLogo/BirmanIcon.png"
                  alt="BongoCatto"
                />
                {!collapsed && <div className="logo-text"> Birman Banking</div>}
              </div>
            </Link>
            {/* Home. */}
            <MenuItem
              component={<Link to="/" className="link" />}
              icon={<Home />}
            >
              Home
            </MenuItem>
            {/* Transfer. */}
            <MenuItem
              component={<Link to="/systems" className="link" />}
              icon={<MoveMoney />}
            >
              Transfer
            </MenuItem>
          </Menu>
        </Sidebar>
      </div>
  
      <div className="bottom-content">
        <Sidebar collapsed={collapsed}>
          <Menu>
            {/* <MenuItem
              component={<Link to="/settings" className="link" />}
              icon={<Gear />}
            >
              Admin Settings
            </MenuItem>
            <MenuItem
              component={<Link to="/settings" className="link" />}
              icon={<Gear />}
            >
              Settings
            </MenuItem> */}
            {/* GitHub. */}
            <MenuItem
              component={<Link to="https://github.com/BeaVert16/Birman-Banking-CPAN-228-Frontend" className="link" />}
              icon={<GitHubIcon />}
            >
              GitHub
            </MenuItem>
          </Menu>
        </Sidebar>
      </div>
    </div>
  );
};

export default Bar;
