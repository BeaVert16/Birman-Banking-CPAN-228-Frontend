import React, { useState, useEffect, useContext } from "react";
import { IsLoggedInContext } from "../../../auth/IsLoggedInCheck";
import { serverIpAddress } from "../../../ServerIpAdd";
import "./CreditPage.css";

export default function CreditPage() {
  const { user } = useContext(IsLoggedInContext);
  const token = user?.token;

  const [applyAmount, setApplyAmount] = useState("");
  const [loans, setLoans] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setMessage("");
    setError("");

    fetch(`${serverIpAddress}/api/loans`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.text();
          throw new Error(error || "Failed to fetch loans");
        }
        return res.json();
      })
      .then((data) => setLoans(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, refreshCounter]);

  const handleApply = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const amt = parseFloat(applyAmount);
    if (isNaN(amt) || amt <= 0) {
      setError("Enter a valid positive amount");
      return;
    }

    try {
      const res = await fetch(`${serverIpAddress}/api/loans/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: amt.toString() }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to apply for loan");
      }

      const loan = await res.json();
      setMessage(`Successfully requested $${loan.amountRequested}`);
      setApplyAmount("");
      setRefreshCounter((c) => c + 1);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePay = async (loanId, amountStr) => {
    setMessage("");
    setError("");

    const amt = parseFloat(amountStr);
    if (isNaN(amt) || amt <= 0) {
      setError("Enter a valid payment amount");
      return;
    }

    try {
      const res = await fetch(`${serverIpAddress}/api/loans/${loanId}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: amt.toString() }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to make payment");
      }

      await res.json();
      setMessage(`Successfully paid $${amt.toFixed(2)} on your loan`);
      setRefreshCounter((c) => c + 1);
    } catch (err) {
      setError(err.message);
    }
  };

  const pending = loans.filter((l) => l.status === "PENDING");
  const outstanding = loans.filter((l) => l.status === "AWAITING_PAYMENT");

  return (
    <div className="credit-page">
      <section className="apply-section">
        <h2>Apply for Credit</h2>
        <form onSubmit={handleApply} className="apply-form">
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount to borrow"
            value={applyAmount}
            onChange={(e) => setApplyAmount(e.target.value)}
            required
          />
          <button type="submit">Submit Application</button>
        </form>
      </section>

      <section className="debts-section">
        <h2>Your Loans</h2>
        {loading && <p>Loading loans…</p>}
        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}

        <div className="loan-group">
          <h3>Pending Approval</h3>
          {pending.length === 0 ? (
            <p>None</p>
          ) : (
            <ul>
              {pending.map((l) => (
                <li key={l.loanId}>
                  ${l.amountRequested.toFixed(2)} — requested on{" "}
                  {new Date(l.loanDate).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="loan-group">
          <h3>Outstanding (Awaiting Payment)</h3>
          {outstanding.length === 0 ? (
            <p>None</p>
          ) : (
            <ul>
              {outstanding.map((l) => (
                <li key={l.loanId} className="outstanding-loan">
                  <div>
                    <strong>${l.amountOutstanding.toFixed(2)}</strong> remaining
                  </div>
                  <div className="pay-form">
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="Pay amount"
                      id={`pay-${l.loanId}`}
                    />
                    <button
                      onClick={() => {
                        const val = document.getElementById(
                          `pay-${l.loanId}`
                        ).value;
                        handlePay(l.loanId, val);
                      }}
                    >
                      Pay
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}