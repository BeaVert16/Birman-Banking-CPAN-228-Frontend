import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useState } from "react";
import { Link } from "react-router-dom";

import "./Sidebar.css";

//----------Icon Imports----------//
import Home from "../../../Icons/Home";
import MoveMoney from "../../../Icons/MoveMoney";
import DBI from "../../../Icons/DashBoard";
import ComputerIcon from "../../../Icons/ComputerIcon";
import Gear from "../../../Icons/Gear";

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

            {/* Settings. */}
            <MenuItem
              component={<Link to="/settings" className="link" />}
              icon={<Gear />}
            >
              Settings
            </MenuItem>
            <a href="https://github.com/BeaVert16/Birman-Banking-CPAN-228-Frontend">
              <div className="bottom-container">
                  <img
                    className="logo"
                    src="Images/GitHubIcon.png"
                    alt="GitHub."
                  />
                  {!collapsed && <div className="logo-text"></div>}
              </div>
            </a>
          </Menu>
        </Sidebar>
      </div>
    </div>
  );
};

export default Bar;
