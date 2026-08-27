import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { serverIpAddress } from "../../../ServerIpAdd";
import fetchApi from "../../../Global/Utils/fetchApi";
import useTokenCheck from "../../../Global/hooks/useTokenCheck";
import LoadingErrorHandler from "../../../Global/Loading/LoadingErrorHandler";

const EditClient = () => {
  const { clientId } = useParams();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { getToken } = useTokenCheck();

  useEffect(() => {
    const fetchClient = async () => {
      setError("");
      setLoading(true);

      try {
        const token = getToken();
        if (!token) return;

        const data = await fetchApi(
          `${serverIpAddress}/api/admin/clients/${clientId}`,
          "GET",
          null,
          token
        );

        setName(data.name);
      } catch (err) {
        setError(err.message || "Failed to fetch client details.");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId, getToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = getToken();
      if (!token) return;

      await fetchApi(
        `${serverIpAddress}/api/admin/clients/${clientId}`,
        "PUT",
        { name },
        token
      );

      navigate("/clients");
    } catch (err) {
      setError(err.message || "Failed to update client.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-client-page">
      <h1>Edit Client</h1>
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
            {loading ? "Updating..." : "Update Client"}
          </button>
        </form>
      </LoadingErrorHandler>
    </div>
  );
};

export default EditClient;
