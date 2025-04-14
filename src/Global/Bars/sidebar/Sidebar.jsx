import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { IsLoggedInContext } from "../../../auth/IsLoggedInCheck";

import "./Sidebar.css";

//----------Icon Imports----------//
import Home from "../../../Icons/Home";
import MoveMoney from "../../../Icons/MoveMoney";
import DBI from "../../../Icons/DashBoard";
import Gear from "../../../Icons/Gear";
import UserIcon from "../../../Icons/UserIcon";
import TransactionIcon from "../../../Icons/TransactionIcon";
import AccountsIcon from "../../../Icons/AccountsIcon";
import AdminIcon from "../../../Icons/AdminIcon";

const Bar = ({ collapsed }) => {
  const { user } = useContext(IsLoggedInContext);
  const isActivated = user?.activated ?? false;
  const isAdmin = user?.role === "ADMIN";

  // Define sidebar options based on user role
  const renderMenuItems = () => {
    if (isAdmin) {
      // Admin-specific sidebar options
      return (
        <>
          <MenuItem
            component={<Link to="/admin-dashboard" className="link" />}
            icon={<AdminIcon />}
          >
            Admin Dashboard
          </MenuItem>
          <MenuItem
            component={<Link to="/admin-dashboard/accounts" className="link" />}
            icon={<AccountsIcon />}
          >
            Accounts
          </MenuItem>
          <MenuItem
            component={
              <Link to="/admin-dashboard/transactions" className="link" />
            }
            icon={<TransactionIcon />}
          >
            Transactions
          </MenuItem>
          <MenuItem
            component={<Link to="/admin-dashboard/clients" className="link" />}
            icon={<DBI />}
          >
            Clients
          </MenuItem>
          <MenuItem
            component={<Link to="/admin-dashboard/users" className="link" />}
            icon={<UserIcon />}
          >
            Users
          </MenuItem>
          <MenuItem
            component={<Link to="/inbox" className="link" />}
            icon={<DBI />}
          >
            Inbox
          </MenuItem>
        </>
      );
    } else {
      // Client-specific sidebar options
      return (
        <>
          <MenuItem
            component={<Link to="/account" className="link" />}
            icon={<Home />}
          >
            My Accounts
          </MenuItem>
          <SubMenu
            label="Transfer"
            icon={<MoveMoney />}
            disabled={!isActivated} // Disable submenu if not activated
          >
            <MenuItem
              className="menu-item"
              component={<Link to="/deposit" className="link" />}
              disabled={!isActivated}
            >
              Deposit
            </MenuItem>
            <MenuItem
              className="menu-item"
              component={<Link to="/internal-transfer" className="link" />}
              disabled={!isActivated}
            >
              Move Money
            </MenuItem>
            <MenuItem
              className="menu-item"
              component={<Link to="/e-transfer" className="link" />}
              disabled={!isActivated}
            >
              e-Transfer
            </MenuItem>
          </SubMenu>
          <MenuItem
            component={<Link to="/inbox" className="link" />}
            icon={<DBI />}
          >
            Inbox
          </MenuItem>
        </>
      );
    }
  };

  return (
    <div className="sidebar-container">
      <div className="content">
        <Sidebar collapsed={collapsed}>
          <Menu className="menu">
            <Link to="/" className="plain-link">
              <div className="logo-container">
                <img
                  className="logo"
                  src="Images/BirmanBankLogo/BirmanIcon.png"
                  alt="BongoCatto"
                />
                {!collapsed && <div className="logo-text">Birman Banking</div>}
              </div>
            </Link>
            {renderMenuItems()}
          </Menu>
        </Sidebar>
      </div>

      <div className="bottom-content">
        <Sidebar collapsed={collapsed}>
          <Menu className="menu">
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
