import React, { useState } from "react";
import { serverIpAddress } from "../ServerIpAdd";
import fetchApi from "../Global/Utils/fetchApi";
import useTokenCheck from "../Global/hooks/useTokenCheck";
import LoadingErrorHandler from "../Global/Loading/LoadingErrorHandler";
import "./AddAdmin.css";

const CreateAdmin = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useTokenCheck();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const token = getToken();
      if (!token) return;

      await fetchApi(
        `${serverIpAddress}/api/admin/create-admin`,
        "POST",
        { cardNumber, password },
        token
      );

      setMessage("Admin created successfully!");
      setCardNumber("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Error creating admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-admin-page">
      <h1>Create Admin</h1>
      <LoadingErrorHandler loading={loading} error={error}>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="cardNumber">Card Number:</label>
            <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Admin"}
          </button>
        </form>
        {message && <p className="success-message">{message}</p>}
      </LoadingErrorHandler>
    </div>
  );
};

export default CreateAdmin;
