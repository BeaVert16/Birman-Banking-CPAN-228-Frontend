import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard-page">
      {/* main header for the admin dashboard */}
      <header className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage clients, accounts, loans, and transactions efficiently.</p>
      </header>

      {/* main content grid */}
      <div className="admin-dashboard-grid">
        {/* clients section */}
        <div
          className="admin-dashboard-card admin-clients-card"
          onClick={() => navigate("/admin-dashboard/clients")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate("/admin-dashboard/clients");
            }
          }}
        >
          <h2>Clients</h2>
          <p>View and manage all registered clients.</p>
        </div>

        {/* accounts section */}
        <div
          className="admin-dashboard-card admin-accounts-card"
          onClick={() => navigate("/admin-dashboard/accounts")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate("/admin-dashboard/accounts");
            }
          }}
        >
          <h2>Accounts</h2>
          <p>Manage client accounts and balances.</p>
        </div>

        {/* loans section */}
        <div
          className="admin-dashboard-card admin-loans-card"
          onClick={() => navigate("/admin-dashboard/loans")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate("/admin-dashboard/loans");
            }
          }}
        >
          <h2>Loans</h2>
          <p>Review and approve or deny loan applications.</p>
        </div>

        {/* transactions section */}
        {/* <div
          className="admin-dashboard-card admin-transactions-card"
          onClick={() => navigate("/admin-dashboard/transactions")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate("/admin-dashboard/transactions");
            }
          }}
        >
          <h2>Transactions</h2>
          <p>Monitor and manage all transactions.</p>
        </div> */}

        {/* users section */}
        <div
          className="admin-dashboard-card admin-users-card"
          onClick={() => navigate("/admin-dashboard/users")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate("/admin-dashboard/users");
            }
          }}
        >
          <h2>Users</h2>
          <p>Manage admin users and their roles.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
