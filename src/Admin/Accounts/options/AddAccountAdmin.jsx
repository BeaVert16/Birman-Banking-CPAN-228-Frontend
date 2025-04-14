import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverIpAddress } from "../../../ServerIpAdd";
import "./AddAccountAdmin.css";

const AddAccountAdmin = () => {
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("Chequing");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { accountId } = useParams(); // Get accountId from URL if in edit mode
  const isEditMode = !!accountId; // Determine if the page is in edit mode

  useEffect(() => {
    if (isEditMode) {
      // Fetch account details if in edit mode
      const fetchAccountDetails = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setError("Authentication token not found.");
            navigate("/login");
            return;
          }
          const response = await fetch(
            `${serverIpAddress}/api/admin/accounts/${accountId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            setError("Failed to fetch account details.");
            return;
          }

          const data = await response.json();
          setAccountName(data.accountName);
          setAccountType(data.accountType); // Keep account type but disable editing
        } catch (e) {
          setError(
            "A network error occurred while fetching account details: " +
              e.message
          );
        }
      };

      fetchAccountDetails();
    }
  }, [isEditMode, accountId, navigate]);

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
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        isEditMode
          ? `${serverIpAddress}/api/admin/accounts/${accountId}`
          : `${serverIpAddress}/api/admin/accounts`,
        {
          method: isEditMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            accountName,
            ...(isEditMode ? {} : { accountType }),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        setError(errorData?.message || "Failed to process the request.");
        if (response.status === 401) {
          navigate("/login");
        }
        return;
      }

      const data = await response.json().catch(() => null);
      navigate("/account", {
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
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${serverIpAddress}/api/admin/accounts/${accountId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        setError(errorData?.message || "Failed to delete the account.");
        return;
      }

      navigate("/account", {
        state: { message: "Account deleted successfully." },
      });
    } catch (e) {
      setError("A network error occurred: " + e.message);
    }
  };

  return (
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
      {error && <p className="error-message">{error}</p>}
      <button onClick={() => navigate("/admin-dashboard/accounts")} className="back-button">
        &larr; Back to Accounts
      </button>
    </div>
  );
};

export default AddAccountAdmin;