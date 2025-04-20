import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IsLoggedInContext } from "../../auth/IsLoggedInCheck";
import { serverIpAddress } from "../../ServerIpAdd";
import "./Loans.css";

export default function Loans() {
  const { user } = useContext(IsLoggedInContext);
  const navigate = useNavigate();
  const token = user?.token;

  const [pendingLoans, setPendingLoans] = useState([]);
  const [approvedLoans, setApprovedLoans] = useState([]);       // ← NEW
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Fetch pending requests
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError("");

    (async () => {
      try {
        const res = await fetch(
          `${serverIpAddress}/api/admin/loans/pending`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error(await res.text());
        setPendingLoans(await res.json());
      } catch (err) {
        setError("Failed to load pending loans: " + err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, refreshCounter]);

  // Fetch approved (outstanding) loans
  useEffect(() => {
    if (!token) return;
    setError("");

    (async () => {
      try {
        const res = await fetch(
          `${serverIpAddress}/api/admin/loans/approved`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error(await res.text());
        setApprovedLoans(await res.json());
      } catch (err) {
        // don't override pending‑error
        console.error("Failed to load approved loans:", err);
      }
    })();
  }, [token, refreshCounter]);

  const handleDecision = async (loanId, approve) => {
    setError("");
    setMessage("");
    if (!token) {
      setError("Not authenticated");
      navigate("/login");
      return;
    }
    try {
      const endpoint = approve
        ? `/api/admin/loans/${loanId}/approve`
        : `/api/admin/loans/${loanId}/deny`;
      const res = await fetch(`${serverIpAddress}${endpoint}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      setMessage(`Loan ${approve ? "approved" : "denied"}.`);
      setRefreshCounter((c) => c + 1);
    } catch (err) {
      setError("Action failed: " + err.message);
    }
  };

  return (
    <div className="loans-page">
      <h1>Loan Management</h1>

      {loading && <p>Loading loans…</p>}
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      {/* Pending Requests */}
      <h2>Pending Requests</h2>
      {pendingLoans.length === 0 ? (
        <p>None</p>
      ) : (
        <ul className="loans-list">
          {pendingLoans.map((loan) => (
            <li key={loan.loanId} className="loan-item">
              <div className="loan-info">
                <div><strong>User:</strong> {loan.userCardNumber}</div>
                <div><strong>Requested:</strong> ${loan.amountRequested}</div>
                <div>
                  <strong>On:</strong>{" "}
                  {new Date(loan.loanDate).toLocaleDateString()}
                </div>
              </div>
              <div className="loan-actions">
                <button
                  onClick={() => handleDecision(loan.loanId, true)}
                  className="approve-button"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecision(loan.loanId, false)}
                  className="deny-button"
                >
                  Deny
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Approved Loans */}
      <h2>Approved</h2>
      {approvedLoans.length === 0 ? (
        <p>None</p>
      ) : (
        <ul className="loans-list">
          {approvedLoans.map((loan) => (
            <li key={loan.loanId} className="loan-item">
              <div className="loan-info">
                <div><strong>User:</strong> {loan.userCardNumber}</div>
                <div>
                  <strong>Owed:</strong> ${loan.amountOutstanding.toFixed(2)}
                </div>
                <div>
                  <strong>Approved on:</strong>{" "}
                  {new Date(loan.decidedAt).toLocaleDateString()}
                </div>
              </div>
              {/* No actions for outstanding loans—they pay via client UI */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
