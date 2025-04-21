import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverIpAddress } from "../../../ServerIpAdd";
import useTokenCheck from "../../../Global/hooks/useTokenCheck";
import FetchApi from "../../../Global/Utils/fetchApi";
import LoadingErrorHandler from "../../../Global/Loading/LoadingErrorHandler";
import "./AddAccountPage.css";

const AddAccountPage = () => {
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("Chequing");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { accountId } = useParams(); // Get accountId from URL if in edit moder
  const { getToken } = useTokenCheck();
  const isEditMode = !!accountId; // Determine if the page is in edit mode

  useEffect(() => {
    if (isEditMode) {
      // Fetch account details if in edit mode
      const fetchAccountDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const token = getToken();
          if (!token) return;

          const data = await FetchApi(
            `${serverIpAddress}/api/accounts/${accountId}/basic`,
            "GET",
            null,
            token
          );
          setAccountName(data.accountName);
          setAccountType(data.accountType); // Keep account type but disable editing
        } catch (e) {
          setError(e.message);
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
        ? `${serverIpAddress}/api/accounts/${accountId}/update-name`
        : `${serverIpAddress}/api/accounts/create`;

      const method = isEditMode ? "PUT" : "POST";
      const body = {
        accountName,
        ...(isEditMode ? {} : { accountType }),
      };

      const data = await FetchApi(endpoint, method, body, token);

      navigate("/account", {
        state: {
          message: isEditMode
            ? "Account updated successfully."
            : `Account created successfully: ${data?.accountId || "N/A"}`,
        },
      });
    } catch (e) {
      setError(e.message);
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

      await FetchApi(
        `${serverIpAddress}/api/accounts/${accountId}/delete`,
        "DELETE",
        null,
        token
      );

      navigate("/account", {
        state: { message: "Account deleted successfully." },
      });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <LoadingErrorHandler loading={loading} error={error}>
      <div className="create-account-page">
        <h2>{isEditMode ? "Edit Account" : "Create a New Account"}</h2>
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
        <button onClick={() => navigate("/account")} className="back-button">
          &larr; Back to Accounts
        </button>
      </div>
    </LoadingErrorHandler>
  );
};

export default AddAccountPage;
