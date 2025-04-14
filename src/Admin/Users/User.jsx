import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serverIpAddress } from "../../ServerIpAdd";
// import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setError("");
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found.");
          navigate("/login");
          return;
        }

        const response = await fetch(`${serverIpAddress}/api/admin/users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          setError(errorData?.message || "Failed to fetch users.");
          if (response.status === 401) {
            navigate("/login");
          }
          return;
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError("A network error occurred: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleDelete = async (cardNumber) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
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
        `${serverIpAddress}/api/admin/users/${cardNumber}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        setError(errorData?.message || "Failed to delete user.");
        if (response.status === 401) {
          navigate("/login");
        }
        return;
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.cardNumber !== cardNumber)
      );
    } catch (error) {
      setError("A network error occurred: " + error.message);
    }
  };

  const handleCreateAdmin = async () => {
    const cardNumber = prompt("Enter the card number for the new admin:");
    const password = prompt("Enter the password for the new admin:");

    if (!cardNumber || !password) {
      alert("Card number and password are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found.");
        navigate("/login");
        return;
      }

      const response = await fetch(`${serverIpAddress}/api/admin/create-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cardNumber, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        setError(errorData?.message || "Failed to create admin.");
        return;
      }

      const newAdmin = await response.json();
      setUsers((prevUsers) => [...prevUsers, newAdmin]);
      alert("Admin created successfully.");
    } catch (error) {
      setError("A network error occurred: " + error.message);
    }
  };

  return (
    <div className="users-page">
      <h1>Users</h1>
      {loading && <p>Loading users...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && users.length === 0 && <p>No users found.</p>}
      <ul className="users-list">
        {users.map((user) => (
          <li key={user.cardNumber} className="user-item">
            <div>
              <strong>Card Number:</strong> {user.cardNumber}
            </div>
            <div>
              <strong>Role:</strong> {user.role}
            </div>
            <button
              onClick={() => handleDelete(user.cardNumber)}
              className="delete-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleCreateAdmin} className="create-admin-button">
        Create Admin
      </button>
    </div>
  );
};

export default Users;