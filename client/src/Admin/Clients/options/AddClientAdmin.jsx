import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverIpAddress } from "../../../ServerIpAdd";
import fetchApi from "../../../Global/Utils/fetchApi";
import useTokenCheck from "../../../Global/hooks/useTokenCheck";
import LoadingErrorHandler from "../../../Global/Loading/LoadingErrorHandler";

const AddClientAdmin = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { getToken } = useTokenCheck();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = getToken();
      if (!token) return;

      await fetchApi(
        `${serverIpAddress}/api/admin/clients`,
        "POST",
        { name },
        token
      );

      navigate("/clients");
    } catch (err) {
      setError(err.message || "Failed to add client.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-client-page">
      <h1>Add Client</h1>
      <LoadingErrorHandler loading={loading} error={error}>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Client"}
          </button>
        </form>
      </LoadingErrorHandler>
    </div>
  );
};

export default AddClientAdmin;
