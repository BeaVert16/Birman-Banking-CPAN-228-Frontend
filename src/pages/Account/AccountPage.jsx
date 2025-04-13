import { useContext } from "react";
import "./AccountPage.css";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import { IsLoggedInContext } from "../../auth/IsLoggedInCheck";
import useFetchAccounts from "../../Global/hooks/useFetchAccounts";

const AccountPage = () => {
  const { user } = useContext(IsLoggedInContext);
  const navigate = useNavigate();
  const { accounts, error } = useFetchAccounts(user);

  const handleAccountClick = (accountId) => {
    navigate(`/account/${accountId}/details`);
  };

  return (
    <div className="account-page">
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
              onClick={() => handleAccountClick(account.accountId)}
            >
              <h3>{account.accountType}</h3>
              <span className="account-id">{account.accountId}</span>
              <p>Balance: ${account.balance.toFixed(2)}</p>
              <p>Status: {account.status}</p>
            </div>
          ))
        ) : (
          !error && <p>No accounts found.</p>
        )}
      </section>
    </div>
  );
};

export default AccountPage;