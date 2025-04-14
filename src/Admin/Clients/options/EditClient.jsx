// filepath: /home/alexander/Documents/Sem-4-Code/Web Application Development/FINAL PROJECT/Birman-Banking-CPAN-228-Frontend/src/Admin/Clients/EditClient.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { serverIpAddress } from "../../ServerIpAdd";

const EditClient = () => {
  const { clientId } = useParams();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
        setName(data.name);
      } catch (error) {
        setError("A network error occurred: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        setError(errorData?.message || "Failed to update client.");
        if (response.status === 401) {
          navigate("/login");
        }
        return;
      }

      navigate("/clients");
    } catch (error) {
      setError("A network error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-client-page">
      <h1>Edit Client</h1>
      {error && <p className="error-message">{error}</p>}
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
    </div>
  );
};

export default EditClient;
