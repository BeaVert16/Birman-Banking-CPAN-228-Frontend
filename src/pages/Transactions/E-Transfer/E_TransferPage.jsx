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

    // Construct the transfer request with all required fields
    const transferRequest = {
      senderClientId: user.token, // Sender's client ID
      senderAccountId: selectedAccountId, // Sender's account ID
      recipientPhoneNumber, // Recipient's phone number
      amount: parseFloat(amount), // Amount to transfer
    };

    console.log("Transfer Request Data:", transferRequest); // Log the transfer request data
    console.log("JWT Token:", user.token); // Log the token for debugging

    try {
      const response = await fetch(
        `${serverIpAddress}/api/transactions/transfer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`, // Include JWT token
          },
          body: JSON.stringify(transferRequest),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Transfer failed");
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
  }) => {
    return (
      <select
        value={selectedAccountId}
        onChange={(e) => setSelectedAccountId(e.target.value)} // Update state on selection
        required
      >
        <option value="">Select an account</option>
        {accounts.map((account) => (
          <option key={account.accountId} value={account.accountId}>
            {account.accountType} - ${account.balance.toFixed(2)}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="transaction-page">
      <h2>Transfer Money</h2>
      <form onSubmit={handleTransfer}>
        {fetchError && <p className="error-message">{fetchError}</p>}
        <AccountDropdown
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          setSelectedAccountId={setSelectedAccountId}
        />
        <div>
          <label>Recipient Phone Number:</label>
          <input
            type="text"
            value={recipientPhoneNumber}
            onChange={(e) => setRecipientPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Transfer</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default E_TransferPage;