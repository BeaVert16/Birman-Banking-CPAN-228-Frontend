import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serverIpAddress } from "../../ServerIpAdd";
// import "./Accounts.css";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      setError("");
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found.");
          navigate("/login");
          return;
        }

        const response = await fetch(`${serverIpAddress}/api/admin/accounts`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          setError(errorData?.message || "Failed to fetch accounts.");
          if (response.status === 401) {
            navigate("/login");
          }
          return;
        }

        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        setError("A network error occurred: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [navigate]);

  const handleEdit = (accountId) => {
    navigate(`/admin-dashboard/accounts/${accountId}/edit`);
  };

  // const handleDelete = async (accountId) => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this account?"
  //   );
  //   if (!confirmDelete) return;

  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       setError("Authentication token not found.");
  //       navigate("/login");
  //       return;
  //     }

  //     const response = await fetch(
  //       `${serverIpAddress}/api/admin/accounts/${accountId}`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => null);
  //       setError(errorData?.message || "Failed to delete account.");
  //       if (response.status === 401) {
  //         navigate("/login");
  //       }
  //       return;
  //     }

  //     setAccounts((prevAccounts) =>
  //       prevAccounts.filter((account) => account.accountId !== accountId)
  //     );
  //   } catch (error) {
  //     setError("A network error occurred: " + error.message);
  //   }
  // };

  return (
    <div className="accounts-page">
      <h1>Accounts</h1>
      {loading && <p>Loading accounts...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && accounts.length === 0 && (
        <p>No accounts found.</p>
      )}
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
            {/* <button
              onClick={() => handleDelete(account.accountId)}
              className="delete-button"
            >
              Delete
            </button> */}
          </li>
        ))}
      </ul>
      {/* <button
        onClick={() => navigate("/admin-dashboard/accounts/add")}
        className="create-account-button"
      >
        Create New Account
      </button> */}
    </div>
  );
};

export default Accounts;