import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverIpAddress } from "../../ServerIpAdd";

const AddClient = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

      const response = await fetch(`${serverIpAddress}/api/admin/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        setError(errorData?.message || "Failed to add client.");
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
    <div className="add-client-page">
      <h1>Add Client</h1>
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
          {loading ? "Adding..." : "Add Client"}
        </button>
      </form>
    </div>
  );
};

export default AddClient;