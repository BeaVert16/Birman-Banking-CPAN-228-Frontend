import React, { useState, useContext, useEffect } from "react";
import { IsLoggedInContext } from "../../../auth/IsLoggedInCheck";
import useFetchAccounts from "../../../Global/hooks/useFetchAccounts";
import { serverIpAddress } from "../../../ServerIpAdd";
import "./InternalTransferPage.css"; // Ensure CSS is imported

const InternalTransferPage = () => {
  const { user } = useContext(IsLoggedInContext);
  const { accounts, error: fetchError, loading } = useFetchAccounts(user); // Added loading state
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Reset 'toAccount' if 'fromAccount' changes to prevent self-transfer selection
  useEffect(() => {
    if (fromAccountId && fromAccountId === toAccountId) {
      setToAccountId("");
    }
  }, [fromAccountId, toAccountId]);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!fromAccountId || !toAccountId || !amount || parseFloat(amount) <= 0) {
      setError(
        "Please select valid 'From' and 'To' accounts and enter a positive transfer amount."
      );
      return;
    }

    if (fromAccountId === toAccountId) {
      setError("Cannot transfer money to the same account.");
      return;
    }

    const transferRequest = {
      fromAccountId,
      toAccountId,
      amount: parseFloat(amount),
    };

    console.log("Internal Transfer Request Data:", transferRequest);
    console.log("JWT Token:", user.token);

    try {
      const response = await fetch(
        `${serverIpAddress}/api/transactions/internal-transfer`, // Updated endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`, // Auth token needed
          },
          body: JSON.stringify(transferRequest),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // Use the error message from the backend if available
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      setMessage(result.message || "Internal transfer successful!"); // Use backend message
      // Optionally clear fields or refetch accounts after successful transfer
      setFromAccountId("");
      setToAccountId("");
      setAmount("");
      // Consider triggering a refetch of accounts if balance updates are needed immediately
    } catch (err) {
       console.error("Transfer failed:", err);
       setError(err.message || "An unexpected error occurred during the transfer.");
    }
  };

  // Filter options for the 'To Account' dropdown
  const toAccountOptions = accounts.filter(
    (account) => account.accountId !== fromAccountId
  );

  return (
    <div className="internal-transfer-page"> {/* Updated class */}
      <div className="transfer-container">
        <h2>Internal Transfer</h2> {/* Updated title */}
        <form onSubmit={handleTransfer}>
          {loading && <p>Loading accounts...</p>}
          {fetchError && (
            <p className="alert-message error-message">{fetchError}</p>
          )}

          {/* From Account Dropdown */}
          <div>
            <label htmlFor="from-account-select">From Account:</label>
            <select
              id="from-account-select"
              value={fromAccountId}
              onChange={(e) => setFromAccountId(e.target.value)}
              required
              disabled={loading || accounts.length === 0}
            >
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option key={account.accountId} value={account.accountId}>
                  {account.accountType} ({account.accountId.slice(-4)}) - ${account.balance.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {/* To Account Dropdown */}
          <div>
            <label htmlFor="to-account-select">To Account:</label>
            <select
              id="to-account-select"
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              required
              disabled={loading || !fromAccountId || toAccountOptions.length === 0} // Disable if no 'from' or no valid 'to' options
            >
              <option value="">Select an account</option>
              {toAccountOptions.map((account) => (
                <option key={account.accountId} value={account.accountId}>
                   {account.accountType} ({account.accountId.slice(-4)}) - ${account.balance.toFixed(2)}
                </option>
              ))}
            </select>
             {!loading && fromAccountId && toAccountOptions.length === 0 && accounts.length > 0 && (
                <p style={{ fontSize: '0.8em', color: '#6c757d', marginTop: '4px' }}>Only one account available.</p>
            )}
          </div>

          {/* Amount Input */}
          <div>
            <label htmlFor="transfer-amount">Amount:</label>
            <input
              id="transfer-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>Transfer</button>
        </form>
        {message && <p className="alert-message success-message">{message}</p>}
        {error && <p className="alert-message error-message">{error}</p>}
      </div>
    </div>
  );
};

export default InternalTransferPage;