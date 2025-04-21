import React, { useState, useEffect } from "react";
import { serverIpAddress } from "../../ServerIpAdd";
import fetchApi from "../../Global/Utils/fetchApi";
import useTokenCheck from "../../Global/hooks/useTokenCheck";
import LoadingErrorHandler from "../../Global/Loading/LoadingErrorHandler";
import "./User.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { getToken } = useTokenCheck();

  useEffect(() => {
    const fetchUsers = async () => {
      setError("");
      setLoading(true);

      try {
        const token = getToken();
        if (!token) return;

        const data = await fetchApi(
          `${serverIpAddress}/api/admin/users`,
          "GET",
          null,
          token
        );
        setUsers(data);
      } catch (err) {
        setError(err.message || "Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [getToken]);

  const handleDelete = async (cardNumber) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      const token = getToken();
      if (!token) return;

      await fetchApi(
        `${serverIpAddress}/api/admin/users/${cardNumber}`,
        "DELETE",
        null,
        token
      );

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.cardNumber !== cardNumber)
      );
    } catch (err) {
      setError(err.message || "Failed to delete user.");
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
      const token = getToken();
      if (!token) return;

      const newAdmin = await fetchApi(
        `${serverIpAddress}/api/admin/create-admin`,
        "POST",
        { cardNumber, password },
        token
      );

      setUsers((prevUsers) => [...prevUsers, newAdmin]);
      alert("Admin created successfully.");
    } catch (err) {
      setError(err.message || "Failed to create admin.");
    }
  };

  return (
    <div className="users-page">
      <h1>Users</h1>
      <LoadingErrorHandler loading={loading} error={error}>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
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
        )}
      </LoadingErrorHandler>
      <button onClick={handleCreateAdmin} className="create-admin-button">
        Create Admin
      </button>
    </div>
  );
};

export default Users;
