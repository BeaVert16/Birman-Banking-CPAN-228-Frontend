import React, { useState } from "react";

const CreateAdmin = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const serverIpAddress = "http://localhost:8080"; // Replace with your server's IP address
  const token = "your-auth-token"; // Replace with your actual token

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${serverIpAddress}/api/admin/create-admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cardNumber, password }),
        }
      );

      if (response.ok) {
        setMessage("Admin created successfully!");
      } else {
        setMessage("Error creating admin.");
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      setMessage("Error creating admin.");
    }
  };

  return (
    <div>
      <h1>Create Admin</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Card Number:</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Create Admin</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateAdmin;
