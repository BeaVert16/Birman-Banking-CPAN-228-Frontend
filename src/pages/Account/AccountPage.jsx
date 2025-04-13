import { useContext, useEffect, useState } from "react";
import "./AccountPage.css";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import { IsLoggedInContext } from "../../auth/IsLoggedInCheck";
import { serverIpAddress } from "../../ServerIpAdd";

const AccountPage = () => {
  const { user } = useContext(IsLoggedInContext);
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found.");
          return;
        }

        const response = await fetch(`${serverIpAddress}/api/accounts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          let errorMsg = `Error: ${response.status} ${response.statusText}`;
          try {
            const errorData = await response.json();
            errorMsg = errorData.message || JSON.stringify(errorData) || errorMsg;
          } catch (e) {
            console.error("Could not parse error response as JSON: "+ e);
          }
          setError(errorMsg);
          if (response.status === 401) {
            console.error("Authentication failed. Token may be invalid or expired.");
          }
          return;
        }

        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setError("Failed to fetch accounts due to a network or server issue.");
      }
    };

    if (user) {
      fetchAccounts();
    }
  }, [user]);

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
              <p>Balance: ${account.balance}</p>
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