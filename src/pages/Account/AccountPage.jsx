import { useContext, useEffect, useState } from "react";
import "./AccountPage.css";
import "../../App.css";
import { useNavigate, useLocation } from "react-router-dom";
import { IsLoggedInContext } from "../../auth/IsLoggedInCheck";
import useFetchAccounts from "../../Global/hooks/useFetchAccounts";

const AccountPage = () => {
  const { user } = useContext(IsLoggedInContext);
  const navigate = useNavigate();
  const { accounts, error } = useFetchAccounts(user);
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message || "");
  const [showPopup, setShowPopup] = useState(!!location.state?.message);

  useEffect(() => {
    if (message) {
      // Clear location.state after displaying the message
      navigate(location.pathname, { replace: true });

      const timer = setTimeout(() => {
        setShowPopup(false); // Hide the popup after 3 seconds
        setMessage(""); // Clear the message
      }, 3000);

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [message, navigate, location.pathname]);

  const handleAccountClick = (accountId) => {
    navigate(`/account/${accountId}/details`);
  };

  const handleEditClick = (e, accountId) => {
    e.stopPropagation(); // Prevent the click event from propagating to the parent
    navigate(`/account/${accountId}/edit`);
  };

  return (
    <div className="account-page">
      {/* Popup Message */}
      {showPopup && <p className="message-popup">{message}</p>}

      <header className="account-header">
        <h1 className="welcome">Welcome, {user?.firstName || "User"}</h1>
      </header>
      <section className="account-list">
        <h2>Account List</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <div
              key={account.accountId}
              className="account-card"
              onClick={() => handleAccountClick(account.accountId)} // Navigate to details page
            >
              <h3>{account.accountType}</h3>
              <span className="account-id">{account.accountId}</span>
              <span className="account-id">{account.accountName}</span>
              <p>Balance: ${account.balance.toFixed(2)}</p>
              <p>Status: {account.status}</p>
              <div className="account-actions">
                <button
                  className="edit-account-button"
                  onClick={(e) => handleEditClick(e, account.accountId)} // Navigate to edit page
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          !error && <p>No accounts found.</p>
        )}
      </section>
      <div>
        <a href="/account/create" className="create-account-button">
          Create New Account
        </a>
      </div>
    </div>
  );
};

export default AccountPage;