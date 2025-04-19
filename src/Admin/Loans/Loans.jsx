import React, { useState, useEffect, useContext } from "react";
import { IsLoggedInContext } from "../../auth/IsLoggedInCheck";
import { serverIpAddress } from "../../ServerIpAdd";
import "./Loans.css";

export default function Loans() {
  const { user } = useContext(IsLoggedInContext);
  const token = user?.token;

  const [pendingLoans, setPendingLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setMessage("");
    setError("");

    fetch(`${serverIpAddress}/api/admin/loans/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.text();
          throw new Error(error || "Failed to load loans");
        }
        return res.json();
      })
      .then((data) => setPendingLoans(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, refreshCounter]);

  const handleDecision = async (loanId, approve) => {
    setMessage("");
    setError("");
    try {
      const endpoint = approve
        ? `/api/admin/loans/${loanId}/approve`
        : `/api/admin/loans/${loanId}/deny`;

      const res = await fetch(`${serverIpAddress}${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Loan action failed");
      }

      setMessage(`Loan ${approve ? "approved" : "denied"} successfully.`);
      setRefreshCounter((c) => c + 1);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-loans-page">
      <h2>Pending Loan Requests</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}

      {pendingLoans.length === 0 ? (
        <p>No pending loans</p>
      ) : (
        <ul className="loan-list">
          {pendingLoans.map((loan) => (
            <li key={loan.loanId} className="loan-item">
              <div>
                <strong>Card:</strong> {loan.userCardNumber} <br />
                <strong>Amount:</strong> ${loan.amountRequested} <br />
                <strong>Requested on:</strong>{" "}
                {new Date(loan.loanDate).toLocaleDateString()}
              </div>
              <div className="loan-actions">
                <button onClick={() => handleDecision(loan.loanId, true)}>
                  Approve
                </button>
                <button onClick={() => handleDecision(loan.loanId, false)}>
                  Deny
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}