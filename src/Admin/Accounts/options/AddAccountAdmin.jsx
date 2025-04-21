import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverIpAddress } from "../../../ServerIpAdd";
import fetchApi from "../../../Global/Utils/fetchApi";
import useTokenCheck from "../../../Global/hooks/useTokenCheck";
import LoadingErrorHandler from "../../../Global/Loading/LoadingErrorHandler";
import "./AddAccountAdmin.css";

const AddAccountAdmin = () => {
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("Chequing");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { accountId } = useParams(); // Get accountId from URL if in edit mode
  const { getToken } = useTokenCheck();
  const isEditMode = !!accountId; // Determine if the page is in edit mode

  useEffect(() => {
    if (isEditMode) {
      // Fetch account details if in edit mode
      const fetchAccountDetails = async () => {
        setLoading(true);
        setError("");
        try {
          const token = getToken();
          if (!token) return;

          const data = await fetchApi(
            `${serverIpAddress}/api/admin/accounts/${accountId}`,
            "GET",
            null,
            token
          );
          setAccountName(data.accountName);
          setAccountType(data.accountType); // Keep account type but disable editing
        } catch (e) {
          setError(
            "A network error occurred while fetching account details: " +
              e.message
          );
        } finally {
          setLoading(false);
        }
      };

      fetchAccountDetails();
    }
  }, [isEditMode, accountId, getToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (!accountName.trim()) {
      setError("Account name is required.");
      setLoading(false);
      return;
    }

    try {
      const token = getToken();
      if (!token) return;

      const endpoint = isEditMode
        ? `${serverIpAddress}/api/admin/accounts/${accountId}`
        : `${serverIpAddress}/api/admin/accounts`;

      const method = isEditMode ? "PUT" : "POST";
      const body = {
        accountName,
        ...(isEditMode ? {} : { accountType }),
      };

      const data = await fetchApi(endpoint, method, body, token);

      navigate("/admin-dashboard/accounts", {
        state: {
          message: isEditMode
            ? "Account updated successfully."
            : `Account created successfully: ${data?.accountId || "N/A"}`,
        },
      });
    } catch (e) {
      setError("A network error occurred: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this account?")) {
      return;
    }

    try {
      const token = getToken();
      if (!token) return;

      await fetchApi(
        `${serverIpAddress}/api/admin/accounts/${accountId}`,
        "DELETE",
        null,
        token
      );

      navigate("/admin-dashboard/accounts", {
        state: { message: "Account deleted successfully." },
      });
    } catch (e) {
      setError("A network error occurred: " + e.message);
    }
  };

  return (
    <div className="create-account-page">
      <h2>{isEditMode ? "Edit Account" : "Create a New Account"}</h2>
      <LoadingErrorHandler loading={loading} error={error}>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="accountName">Account Name:</label>
            <input
              type="text"
              id="accountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
          </div>
          {!isEditMode && (
            <div>
              <label htmlFor="accountType">Account Type:</label>
              <select
                id="accountType"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option value="Chequing">Chequing</option>
                <option value="Savings">Savings</option>
              </select>
            </div>
          )}
          <button type="submit" disabled={loading}>
            {loading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update Account"
              : "Create Account"}
          </button>
        </form>
        {isEditMode && (
          <button
            onClick={handleDelete}
            className="delete-account-button"
            disabled={loading}
          >
            Delete Account
          </button>
        )}
        {message && <p className="success-message">{message}</p>}
      </LoadingErrorHandler>
      <button
        onClick={() => navigate("/admin-dashboard/accounts")}
        className="back-button"
      >
        &larr; Back to Accounts
      </button>
    </div>
  );
};

export default AddAccountAdmin;
