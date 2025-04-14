import React, { useState, useContext, useEffect } from "react";
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
  const [countdown, setCountdown] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [warningAcknowledged, setWarningAcknowledged] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timerId = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (countdown === 0 && isButtonDisabled) {
      setIsButtonDisabled(false);
      setError("");
      setWarningAcknowledged(true);
    }
  }, [countdown, isButtonDisabled]);

  const handleTransfer = async (e) => {
    e.preventDefault();

    if (isButtonDisabled) return;

    setMessage("");
    setError("");

    if (
      !selectedAccountId ||
      !recipientPhoneNumber ||
      !amount ||
      parseFloat(amount) <= 0
    ) {
      setError("Please fill in all fields with valid values.");
      return;
    }

    // Show warning only once for large transfers
    if (parseFloat(amount) >= 500 && !warningAcknowledged) {
      setError(
        <>
          Warning: Transfers of $500 or more may be scams. Please confirm the
          recipient’s details.{" "}
          <a href="#" onClick={(e) => e.preventDefault()}>
            Learn more
          </a>
        </>
      );
      setIsButtonDisabled(true);
      setCountdown(7);
      return;
    }

    const transferRequest = {
      senderClientId: user.token,
      senderAccountId: selectedAccountId,
      recipientPhoneNumber,
      amount: parseFloat(amount),
    };

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
      if (!response.ok) throw new Error(result.error || "Transfer failed");

      setMessage(result.message);
      setWarningAcknowledged(false); // Reset for next transfer
    } catch (err) {
      setError(err.message);
    }
  };

  const AccountDropdown = ({ accounts, selectedAccountId, setSelectedAccountId }) => (
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

  return (
    <div className="e-transfer-page">
      <div className="transfer-container">
        <h2>Transfer Money</h2>
        <form onSubmit={handleTransfer}>
          {fetchError && <p className="alert-message error-message">{fetchError}</p>}
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
              min="0.01"
              step="0.01"
              required
            />
          </div>
          <button type="submit" disabled={isButtonDisabled}>
            {isButtonDisabled ? `Wait ${countdown}s` : "Transfer"}
          </button>
        </form>
        {message && <p className="alert-message success-message">{message}</p>}
        {error && <p className="alert-message error-message">{error}</p>}
      </div>
    </div>
  );
};

export default E_TransferPage;
