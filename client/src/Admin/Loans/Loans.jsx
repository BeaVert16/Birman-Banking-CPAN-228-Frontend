import React, { useState, useEffect} from "react";
import { serverIpAddress } from "../../ServerIpAdd";
import fetchApi from "../../Global/Utils/fetchApi";
import useTokenCheck from "../../Global/hooks/useTokenCheck";
import LoadingErrorHandler from "../../Global/Loading/LoadingErrorHandler";
import "./Loans.css";

export default function Loans() {
  const { getToken } = useTokenCheck();

  const [pendingLoans, setPendingLoans] = useState([]);
  const [approvedLoans, setApprovedLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Fetch pending requests
  useEffect(() => {
    const fetchPendingLoans = async () => {
      setLoading(true);
      setError("");

      try {
        const token = getToken();
        if (!token) return;

        const data = await fetchApi(
          `${serverIpAddress}/api/admin/loans/pending`,
          "GET",
          null,
          token
        );
        setPendingLoans(data);
      } catch (err) {
        setError("Failed to load pending loans: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingLoans();
  }, [getToken, refreshCounter]);

  // Fetch approved (outstanding) loans
  useEffect(() => {
    const fetchApprovedLoans = async () => {
      setError("");

      try {
        const token = getToken();
        if (!token) return;

        const data = await fetchApi(
          `${serverIpAddress}/api/admin/loans/approved`,
          "GET",
          null,
          token
        );
        setApprovedLoans(data);
      } catch (err) {
        console.error("Failed to load approved loans:", err.message);
      }
    };

    fetchApprovedLoans();
  }, [getToken, refreshCounter]);

  const handleDecision = async (loanId, approve) => {
    setError("");
    setMessage("");

    try {
      const token = getToken();
      if (!token) return;

      const endpoint = approve
        ? `/api/admin/loans/${loanId}/approve`
        : `/api/admin/loans/${loanId}/deny`;

      await fetchApi(`${serverIpAddress}${endpoint}`, "POST", null, token);

      setMessage(`Loan ${approve ? "approved" : "denied"}.`);
      setRefreshCounter((c) => c + 1);
    } catch (err) {
      setError("Action failed: " + err.message);
    }
  };

  return (
    <div className="loans-page">
      <h1>Loan Management</h1>
      <LoadingErrorHandler loading={loading} error={error}>
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
                  <div>
                    <strong>User:</strong> {loan.userCardNumber}
                  </div>
                  <div>
                    <strong>Requested:</strong> ${loan.amountRequested}
                  </div>
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
                  <div>
                    <strong>User:</strong> {loan.userCardNumber}
                  </div>
                  <div>
                    <strong>Owed:</strong> ${loan.amountOutstanding.toFixed(2)}
                  </div>
                  <div>
                    <strong>Approved on:</strong>{" "}
                    {new Date(loan.decidedAt).toLocaleDateString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </LoadingErrorHandler>
    </div>
  );
}
