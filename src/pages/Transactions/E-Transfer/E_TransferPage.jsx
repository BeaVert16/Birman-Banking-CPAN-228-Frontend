import React, { useState, useContext } from "react";
import { IsLoggedInContext } from "../../../auth/IsLoggedInCheck";
import useFetchAccounts from "../../../Global/hooks/useFetchAccounts";
import { serverIpAddress } from "../../../ServerIpAdd";
import "./E_TransferPage.css";

const E_TransferPage = () => {
  const { user } = useContext(IsLoggedInContext);
  const { accounts, error: fetchError } = useFetchAccounts(user);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [recipientPhoneNumber, setRecipientPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleTransfer = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (
      !selectedAccountId ||
      !recipientPhoneNumber ||
      !amount ||
      parseFloat(amount) <= 0
    ) {
      setError(
        "Please select an account, provide a recipient phone number, and a positive transfer amount."
      );
      return;
    }

    const transferRequest = {
      senderClientId: user.token,
      senderAccountId: selectedAccountId,
      recipientPhoneNumber,
      amount: parseFloat(amount),
    };

    console.log("Transfer Request Data:", transferRequest);
    console.log("JWT Token:", user.token);

    try {
      const response = await fetch(
        `${serverIpAddress}/api/transactions/transfer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(transferRequest),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Transfer failed");
      }

      setMessage(result.message);
      // Optionally clear fields after successful transfer
      // setSelectedAccountId("");
      // setRecipientPhoneNumber("");
      // setAmount("");
    } catch (err) {
      setError(err.message);
    }
  };

  const AccountDropdown = ({
    accounts,
    selectedAccountId,
    setSelectedAccountId,
  }) => {
    return (
      <div>
        <label htmlFor="account-select">From Account:</label>
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
  };

  return (
    <div className="e-transfer-page">
      {" "}
      {/* Updated class */}
      <div className="transfer-container">
        {" "}
        {/* Updated class */}
        <h2>Transfer Money</h2>
        <form onSubmit={handleTransfer}>
          {fetchError && (
            <p className="alert-message error-message">{fetchError}</p>
          )}{" "}
          {/* Added base class */}
          <AccountDropdown
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            setSelectedAccountId={setSelectedAccountId}
          />
          <div>
            <label htmlFor="recipient-phone">Recipient Phone Number:</label>
            <input
              id="recipient-phone"
              type="text"
              value={recipientPhoneNumber}
              onChange={(e) => setRecipientPhoneNumber(e.target.value)}
              placeholder="e.g., 123-456-7890"
              required
            />
          </div>
          <div>
            <label htmlFor="transfer-amount">Amount:</label>
            <input
              id="transfer-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0.01" // Ensure positive amount
              step="0.01" // Allow cents
              required
            />
          </div>
          <button type="submit">Transfer</button>
        </form>
        {message && <p className="alert-message success-message">{message}</p>}{" "}
        {/* Added base class */}
        {error && <p className="alert-message error-message">{error}</p>}{" "}
        {/* Added base class */}
      </div>
    </div>
  );
};

export default E_TransferPage;
