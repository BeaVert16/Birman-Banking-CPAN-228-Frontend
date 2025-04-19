import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serverIpAddress } from "../../ServerIpAdd";
// import "./Transactions.css";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      setError("");
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found.");
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${serverIpAddress}/api/admin/transactions`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          setError(errorData?.message || "Failed to fetch transactions.");
          if (response.status === 401) {
            navigate("/login");
          }
          return;
        }

        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        setError("A network error occurred: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [navigate]);

  return (
    <div className="transactions-page">
      <h1>Transactions</h1>
      {loading && <p>Loading transactions...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && transactions.length === 0 && (
        <p>No transactions found.</p>
      )}
      <ul className="transactions-list">
        {transactions.map((transaction) => (
          <li key={transaction.transactionId} className="transaction-item">
            <div>
              <strong>Transaction ID:</strong> {transaction.transactionId}
            </div>
            <div>
              <strong>Amount:</strong> ${transaction.amount.toFixed(2)}
            </div>
            <div>
              <strong>Date:</strong> {new Date(transaction.date).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;