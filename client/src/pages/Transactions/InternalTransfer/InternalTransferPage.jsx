import React, { useState, useContext, useEffect } from "react";
import { IsLoggedInContext } from "../../../auth/IsLoggedInCheck";
import useFetchAccounts from "../../../Global/hooks/useFetchAccounts";
import { serverIpAddress } from "../../../ServerIpAdd";
import fetchApi from "../../../Global/Utils/fetchApi";
import LoadingErrorHandler from "../../../Global/Loading/LoadingErrorHandler";
import "./InternalTransferPage.css";

const InternalTransferPage = () => {
  const { user } = useContext(IsLoggedInContext);
  const { accounts, error: fetchError, loading } = useFetchAccounts(user);
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

    try {
      const result = await fetchApi(
        `${serverIpAddress}/api/transactions/internal-transfer`,
        "POST",
        transferRequest,
        user.token
      );

      setMessage(result.message || "Internal transfer successful!");
      setFromAccountId("");
      setToAccountId("");
      setAmount("");
    } catch (err) {
      setError(
        err.message || "An unexpected error occurred during the transfer."
      );
    }
  };

  const AccountDropdown = ({
    accounts,
    selectedAccountId,
    setSelectedAccountId,
    label,
  }) => (
    <div>
      <label htmlFor="account-select">{label}</label>
      <select
        id="account-select"
        value={selectedAccountId}
        onChange={(e) => setSelectedAccountId(e.target.value)}
        required
        disabled={loading || accounts.length === 0}
      >
        <option value="">Select an account</option>
        {accounts.map((account) => (
          <option key={account.accountId} value={account.accountId}>
            {account.accountType} ({account.accountId.slice(-4)}) - $
            {account.balance.toFixed(2)}
          </option>
        ))}
      </select>
    </div>
  );

  const toAccountOptions = accounts.filter(
    (account) => account.accountId !== fromAccountId
  );

  return (
    <div className="internal-transfer-container">
      <div className="internal-transfer-card">
        <h2>Internal Transfer</h2>
        <LoadingErrorHandler loading={loading} error={fetchError}>
          <form className="internal-transfer-form" onSubmit={handleTransfer}>
            <AccountDropdown
              accounts={accounts}
              selectedAccountId={fromAccountId}
              setSelectedAccountId={setFromAccountId}
              label="From Account:"
            />
            <AccountDropdown
              accounts={toAccountOptions}
              selectedAccountId={toAccountId}
              setSelectedAccountId={setToAccountId}
              label="To Account:"
            />
            <div>
              <label htmlFor="transfer-amount">Amount:</label>
              <div className="input-with-dollar">
                <span>$</span>
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
            </div>
            <button type="submit" disabled={loading}>
              Transfer
            </button>
          </form>
          {message && (
            <p className="internal-transfer-message success">{message}</p>
          )}
          {error && <p className="internal-transfer-message error">{error}</p>}
        </LoadingErrorHandler>
      </div>
    </div>
  );
};

export default InternalTransferPage;
