import React, { useState, useEffect, useContext } from "react";
import { IsLoggedInContext } from "../../../auth/IsLoggedInCheck";
import { serverIpAddress } from "../../../ServerIpAdd";
import fetchApi from "../../../Global/Utils/fetchApi";
import LoadingErrorHandler from "../../../Global/Loading/LoadingErrorHandler";
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
    const fetchLoans = async () => {
      if (!token) return;
      setLoading(true);
      setMessage("");
      setError("");

      try {
        const data = await fetchApi(
          `${serverIpAddress}/api/loans`,
          "GET",
          null,
          token
        );
        setLoans(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
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
      const loan = await fetchApi(
        `${serverIpAddress}/api/loans/request`,
        "POST",
        { amount: amt.toString() },
        token
      );
      setMessage(`Requested $${loan.amountRequested}`);
      setApplyAmount("");
      setRefreshCounter((c) => c + 1);
    } catch (e) {
      setError(e.message);
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
      await fetchApi(
        `${serverIpAddress}/api/loans/${loanId}/pay`,
        "POST",
        { amount: amt.toString() },
        token
      );
      setMessage(`Paid $${amt.toFixed(2)}`);
      setRefreshCounter((c) => c + 1);
    } catch (e) {
      setError(e.message);
    }
  };

  const pending = loans.filter((l) => l.status === "PENDING");
  const outstanding = loans.filter((l) => l.status === "AWAITING_PAYMENT");

  return (
    <div className="credit-container">
      <div className="credit-card">
        <h2>Credit</h2>
        <LoadingErrorHandler loading={loading} error={error}>
          {/* Application Form */}
          <form className="credit-form" onSubmit={handleApply}>
            {message && <p className="credit-message success">{message}</p>}
            {error && <p className="credit-message error">{error}</p>}
            <label htmlFor="loan-amount">Amount to Borrow</label>
            <div className="input-with-dollar">
              <span>$</span>
              <input
                id="loan-amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={applyAmount}
                onChange={(e) => setApplyAmount(e.target.value)}
                required
              />
            </div>
            <button type="submit">Submit Application</button>
          </form>

          {/* Pending Loans */}
          <div className="credit-loan-group">
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

          {/* Outstanding Loans */}
          <div className="credit-loan-group">
            <h3>Outstanding (Awaiting Payment)</h3>
            {outstanding.length === 0 ? (
              <p>None</p>
            ) : (
              <ul>
                {outstanding.map((l) => (
                  <li key={l.loanId} className="outstanding-loan">
                    <div>
                      <strong>${l.amountOutstanding.toFixed(2)}</strong>{" "}
                      remaining.
                    </div>
                    <div className="pay-form">
                      <div className="input-with-dollar">
                        <span>$</span>
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="Pay amount"
                          id={`pay-${l.loanId}`}
                        />
                      </div>
                      <button
                        onClick={() =>
                          handlePay(
                            l.loanId,
                            document.getElementById(`pay-${l.loanId}`).value
                          )
                        }
                      >
                        Pay
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </LoadingErrorHandler>
      </div>
    </div>
  );
}
