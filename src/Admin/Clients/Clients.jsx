import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serverIpAddress } from "../../ServerIpAdd";
import "./Clients.css";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      setError("");
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found.");
          navigate("/login");
          return;
        }

        const response = await fetch(`${serverIpAddress}/api/admin/clients`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          setError(errorData?.message || "Failed to fetch clients.");
          if (response.status === 401) {
            navigate("/login");
          }
          return;
        }

        const data = await response.json();
        setClients(data);
      } catch (error) {
        setError("A network error occurred: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [navigate]);

  const handleEdit = (clientId) => {
    navigate(`/client/edit/${clientId}`);
  };

  const handleDelete = async (clientId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    );
    if (!confirmDelete) return;

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
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        setError(errorData?.message || "Failed to delete client.");
        if (response.status === 401) {
          navigate("/login");
        }
        return;
      }

      setClients((prevClients) =>
        prevClients.filter((client) => client.clientId !== clientId)
      );
    } catch (error) {
      setError("A network error occurred: " + error.message);
    }
  };

  return (
    <div className="clients-page">
      <h1>Clients</h1>
      {loading && <p>Loading clients...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && clients.length === 0 && <p>No clients found.</p>}
      <ul className="clients-list">
        {clients.map((client) => (
          <li key={client.clientId} className="client-item">
            <div>
              <strong>Client ID:</strong> {client.clientId}
            </div>
            {/* <div>
              <strong>Name:</strong> {client.name}
            </div> */}
            {/* <button
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
            </button> */}
          </li>
        ))}
      </ul>
      {/* <button
        onClick={() => navigate("/client/add")}
        className="create-client-button"
      >
        Create New Client
      </button> */}
    </div>
  );
};

export default Clients;