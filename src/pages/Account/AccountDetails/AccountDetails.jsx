import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingErrorHandler from "../../../Global/Loading/LoadingErrorHandler";
import { serverIpAddress } from "../../../ServerIpAdd";
import useTokenCheck from "../../../Global/hooks/useTokenCheck";
import fetchApi from "../../../Global/Utils/fetchApi";
import formatCurrency from "../../../Global/Utils/formatCurrency";
import "./AccountDetails.css";

const AccountDetails = () => {
  const { accountId } = useParams(); // Get accountId from URL
  const { getToken } = useTokenCheck();

  const navigate = useNavigate();
  const [accountDetails, setAccountDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const itemsPerPage = 10; // Number of transactions per page

  useEffect(() => {
    const fetchAccountDetails = async (page = 0) => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        if (!token) return;

        const data = await fetchApi(
          `${serverIpAddress}/api/accounts/${accountId}/details?page=${page}&size=${itemsPerPage}&sort=timestamp,desc`,
          "GET",
          null,
          token
        );

        setAccountDetails(data.account);
        setTransactions(data.transactions.content);
        setCurrentPage(data.transactions.number);
        setTotalPages(data.transactions.totalPages);
        setTotalElements(data.transactions.totalElements);
      } catch (e) {
        setError(
          "A network error occurred while fetching account details: " + e
        );
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchAccountDetails(currentPage);
    }
  }, [accountId, currentPage, getToken]);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <LoadingErrorHandler loading={loading} error={error}>
      {accountDetails && (
        <div className="account-details-page">
          <h2>{accountDetails.accountType} Account</h2>
          <div className="card account-summary">
            <h3>Account Details</h3>
            <p>Account ID: {accountDetails.accountId}</p>
            <p className="balance">
              Balance: ${formatCurrency(accountDetails.balance)}
            </p>
            <p>Status: {accountDetails.status}</p>
            <p>
              Created At: {new Date(accountDetails.createdAt).toLocaleString()}
            </p>
          </div>

          <h3>Recent Transactions</h3>
          {transactions.length > 0 ? (
            <>
              <div className="transaction-list">
                {transactions.map((tx) => (
                  <div key={tx.transactionId} className="card transaction-item">
                    <p>Type: {tx.transactionType}</p>
                    <p>
                      Amount:{" "}
                      <span
                        className={
                          tx.transactionAmount >= 0 ? "positive" : "negative"
                        }
                      >
                        ${formatCurrency(Math.abs(tx.transactionAmount))}
                      </span>
                    </p>
                    <p>Date: {new Date(tx.timestamp).toLocaleString()}</p>
                    <p>Description: {tx.description || "N/A"}</p>
                    <p>
                      Balance After: $
                      {formatCurrency(tx.postTransactionBalance)}
                    </p>
                    {tx.transferToAccountId && (
                      <p>Transfer To: {tx.transferToAccountId}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="pagination-controls">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage + 1} of {totalPages} ({totalElements} items)
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p>No transactions found for this account.</p>
          )}
          <button onClick={() => navigate("/account")} className="back-button">
            &larr; Back to Accounts
          </button>
        </div>
      )}
    </LoadingErrorHandler>
  );
};

export default AccountDetails;
