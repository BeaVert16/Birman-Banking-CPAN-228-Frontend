import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { serverIpAddress } from "../../ServerIpAdd";

const ViewClient = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClient = async () => {
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
          `${serverIpAddress}/api/admin/clients/${clientId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          setError(errorData?.message || "Failed to fetch client details.");
          if (response.status === 401) {
            navigate("/login");
          }
          return;
        }

        const data = await response.json();
        setClient(data);
      } catch (error) {
        setError("A network error occurred: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId, navigate]);

  return (
    <div className="view-client-page">
      <h1>View Client</h1>
      {loading && <p>Loading client details...</p>}
      {error && <p className="error-message">{error}</p>}
      {client && (
        <div>
          <p>
            <strong>Client ID:</strong> {client.clientId}
          </p>
          <p>
            <strong>Name:</strong> {client.name}
          </p>
        </div>
      )}
      <button onClick={() => navigate("/clients")}>Back to Clients</button>
    </div>
  );
};

export default ViewClient;
