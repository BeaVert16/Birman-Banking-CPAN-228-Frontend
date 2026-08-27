import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { serverIpAddress } from "../../../ServerIpAdd";
import fetchApi from "../../../Global/Utils/fetchApi";
import useTokenCheck from "../../../Global/hooks/useTokenCheck";
import LoadingErrorHandler from "../../../Global/Loading/LoadingErrorHandler";

const ViewClient = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
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

        setClient(data);
      } catch (err) {
        setError(err.message || "Failed to fetch client details.");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId, getToken]);

  return (
    <div className="view-client-page">
      <h1>View Client</h1>
      <LoadingErrorHandler loading={loading} error={error}>
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
      </LoadingErrorHandler>
    </div>
  );
};

export default ViewClient;
