import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serverIpAddress } from "../../ServerIpAdd";
import fetchApi from "../../Global/Utils/fetchApi";
import useTokenCheck from "../../Global/hooks/useTokenCheck";
import LoadingErrorHandler from "../../Global/Loading/LoadingErrorHandler";
import "./Accounts.css";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getToken } = useTokenCheck();

  useEffect(() => {
    const fetchAccounts = async () => {
      setError("");
      setLoading(true);

      try {
        const token = getToken();
        if (!token) return;

        const data = await fetchApi(
          `${serverIpAddress}/api/admin/accounts`,
          "GET",
          null,
          token
        );
        setAccounts(data);
      } catch (err) {
        setError(err.message || "Failed to fetch accounts.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [getToken]);

  const handleEdit = (accountId) => {
    navigate(`/admin-dashboard/accounts/${accountId}/edit`);
  };

  const handleCreateAccount = () => {
    navigate("/admin-dashboard/accounts/add");
  };

  return (
    <div className="accounts-page">
      <h1>Accounts</h1>
      <LoadingErrorHandler loading={loading} error={error}>
        {accounts.length === 0 ? (
          <p>No accounts found.</p>
        ) : (
          <ul className="accounts-list">
            {accounts.map((account) => (
              <li key={account.accountId} className="account-item">
                <div>
                  <strong>Account ID:</strong> {account.accountId}
                </div>
                <div>
                  <strong>Balance:</strong> ${account.balance.toFixed(2)}
                </div>
                <button
                  onClick={() => handleEdit(account.accountId)}
                  className="edit-button"
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        )}
      </LoadingErrorHandler>
      <button onClick={handleCreateAccount} className="create-account-button">
        Create New Account
      </button>
    </div>
  );
};

export default Accounts;
