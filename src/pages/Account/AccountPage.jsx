import { useContext, useEffect, useState } from "react";
import "./AccountPage.css";
import "../../App.css";
import { useNavigate, useLocation } from "react-router-dom";
import { IsLoggedInContext } from "../../auth/IsLoggedInCheck";
import useFetchAccounts from "../../Global/hooks/useFetchAccounts";
import LoadingErrorHandler from "../../Global/Loading/LoadingErrorHandler";
import formatCurrency from "../../Global/Utils/formatCurrency";

const AccountPage = () => {
  const { user } = useContext(IsLoggedInContext);
  const navigate = useNavigate();
  const { accounts, error, loading } = useFetchAccounts(user);
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message || "");
  const [showPopup, setShowPopup] = useState(!!location.state?.message);

  useEffect(() => {
    if (message) {
      navigate(location.pathname, { replace: true, state: {} });

      const timer = setTimeout(() => {
        setShowPopup(false);
        setMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, navigate, location.pathname]);

  const handleAccountClick = (accountId) => {
    navigate(`/account/${accountId}/details`);
  };

  const handleEditClick = (e, accountId) => {
    e.stopPropagation();
    navigate(`/account/${accountId}/edit`);
  };

  const handleCreateAccount = () => {
    navigate("/account/create");
  };

  return (
    <div className="account-page">
      {showPopup && <div className="message-popup">{message}</div>}

      <header className="account-header">
        <h1 className="welcome">Welcome, {user?.firstName || "User"}</h1>
      </header>
      <section className="account-list">
        <h2>Your Accounts</h2>
        <LoadingErrorHandler loading={loading} error={error}>
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <div
                key={account.accountId}
                className="account-card"
                onClick={() => handleAccountClick(account.accountId)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleAccountClick(account.accountId);
                  }
                }}
              >
                <h3>{account.accountType}</h3>
                <div className="account-details">
                  <span className="account-id">
                    Name: {account.accountName}
                  </span>
                  <span className="account-id">
                    Account #: {account.accountId}
                  </span>
                </div>
                <p className="account-balance">
                  {formatCurrency(account.balance)}
                </p>
                <p className="account-status">Status: {account.status}</p>
                <div className="account-actions">
                  <button
                    className="edit-account-button"
                    onClick={(e) => handleEditClick(e, account.accountId)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>No accounts found.</p>
          )}
        </LoadingErrorHandler>
      </section>
      <div>
        <button onClick={handleCreateAccount} className="create-account-button">
          Create New Account
        </button>
      </div>
    </div>
  );
};

export default AccountPage;
