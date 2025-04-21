import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serverIpAddress } from "../../ServerIpAdd";
import fetchApi from "../../Global/Utils/fetchApi";
import useTokenCheck from "../../Global/hooks/useTokenCheck";
import LoadingErrorHandler from "../../Global/Loading/LoadingErrorHandler";
import "./Clients.css";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getToken } = useTokenCheck();

  useEffect(() => {
    const fetchClients = async () => {
      setError("");
      setLoading(true);

      try {
        const token = getToken();
        if (!token) return;

        const data = await fetchApi(
          `${serverIpAddress}/api/admin/clients`,
          "GET",
          null,
          token
        );
        setClients(data);
      } catch (err) {
        setError(err.message || "Failed to fetch clients.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [getToken]);

  const handleEdit = (clientId) => {
    navigate(`/client/edit/${clientId}`);
  };

  const handleDelete = async (clientId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    );
    if (!confirmDelete) return;

    try {
      const token = getToken();
      if (!token) return;

      await fetchApi(
        `${serverIpAddress}/api/admin/clients/${clientId}`,
        "DELETE",
        null,
        token
      );

      setClients((prevClients) =>
        prevClients.filter((client) => client.clientId !== clientId)
      );
    } catch (err) {
      setError(err.message || "Failed to delete client.");
    }
  };

  return (
    <div className="clients-page">
      <h1>Clients</h1>
      <LoadingErrorHandler loading={loading} error={error}>
        {clients.length === 0 ? (
          <p>No clients found.</p>
        ) : (
          <ul className="clients-list">
            {clients.map((client) => (
              <li key={client.clientId} className="client-item">
                <div>
                  <strong>Client ID:</strong> {client.clientId}
                </div>
                <div>
                  <strong>Name:</strong> {client.name}
                </div>
                <button
                  onClick={() => handleEdit(client.clientId)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(client.clientId)}
                  className="delete-button"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </LoadingErrorHandler>
      <button
        onClick={() => navigate("/client/add")}
        className="create-client-button"
      >
        Create New Client
      </button>
    </div>
  );
};

export default Clients;
