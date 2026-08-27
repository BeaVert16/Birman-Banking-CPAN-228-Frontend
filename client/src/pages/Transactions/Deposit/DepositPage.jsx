import React, { useState, useContext } from "react";
import { IsLoggedInContext } from "../../../auth/IsLoggedInCheck";
import useFetchAccounts from "../../../Global/hooks/useFetchAccounts";
import { serverIpAddress } from "../../../ServerIpAdd";
import fetchApi from "../../../Global/Utils/fetchApi";
import LoadingErrorHandler from "../../../Global/Loading/LoadingErrorHandler";
import formatCurrency from "../../../Global/Utils/formatCurrency";
import "./DepositPage.css";

const DepositPage = () => {
  const { user } = useContext(IsLoggedInContext);
  const { accounts, error: fetchError, loading } = useFetchAccounts(user);
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

    try {
      const depositRequest = {
        accountId: selectedAccountId,
        amount: parseFloat(amount),
      };

      const result = await fetchApi(
        `${serverIpAddress}/api/transactions/deposit`,
        "POST",
        depositRequest,
        user.token
      );

      setMessage(result.message || "Deposit successful!");
      setAmount("");
      setSelectedAccountId("");
    } catch (err) {
      setError(err.message || "Deposit failed. Please try again.");
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
            {account.accountType} - {formatCurrency(account.balance)}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="deposit-container">
      <div className="deposit-card">
        <h2>Deposit Money</h2>
        <LoadingErrorHandler loading={loading} error={fetchError}>
          <form className="deposit-form" onSubmit={handleDeposit}>
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
          {message && <p className="deposit-message success">{message}</p>}
          {error && <p className="deposit-message error">{error}</p>}
        </LoadingErrorHandler>
      </div>
    </div>
  );
};

export default DepositPage;
