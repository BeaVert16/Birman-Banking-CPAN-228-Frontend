import React, { useState, useContext } from "react";
import { IsLoggedInContext } from "../../../auth/IsLoggedInCheck";
import useFetchAccounts from "../../../Global/hooks/useFetchAccounts";
import { serverIpAddress } from "../../../ServerIpAdd";
import "./DepositPage.css";

const DepositPage = () => {
  const { user } = useContext(IsLoggedInContext);
  const { accounts, error: fetchError } = useFetchAccounts(user);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleDeposit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!selectedAccountId || !amount || parseFloat(amount) <= 0) {
      setError(
        "Please select an account and provide a positive deposit amount."
      );
      return;
    }

    const depositRequest = {
      accountId: selectedAccountId,
      amount: parseFloat(amount),
    };

    try {
      const response = await fetch(
        `${serverIpAddress}/api/transactions/deposit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(depositRequest),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Deposit failed");
      }

      setMessage(result.message);
    } catch (err) {
      setError(err.message);
    }
  };

  const AccountDropdown = ({
    accounts,
    selectedAccountId,
    setSelectedAccountId,
  }) => (
    <div>
      <label htmlFor="account-select">Select Account:</label>
      <select
        id="account-select"
        value={selectedAccountId}
        onChange={(e) => setSelectedAccountId(e.target.value)}
        required
      >
        <option value="">Select an account</option>
        {accounts.map((account) => (
          <option key={account.accountId} value={account.accountId}>
            {account.accountType} - ${account.balance.toFixed(2)}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="deposit-page">
      <div className="transaction-page">
        <h2>Deposit Money</h2>
        <form onSubmit={handleDeposit}>
          {fetchError && <p className="error-message">{fetchError}</p>}
          <AccountDropdown
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            setSelectedAccountId={setSelectedAccountId}
          />
          <div>
            <label htmlFor="deposit-amount">Deposit Amount:</label>
            <div className="input-with-dollar">
              <span>$</span>
              <input
                id="deposit-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit">Deposit</button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default DepositPage;
