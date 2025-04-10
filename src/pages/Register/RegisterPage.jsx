import React, { useState } from "react";
import { serverIpAddress } from "../../ServerIpAdd";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    address: "",
    sin: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${serverIpAddress}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          address: formData.address,
          sin: formData.sin,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(result.message || "Registration successful!");
        setError("");
        setTimeout(() => navigate("/login"), 2000); // Redirect to login page after 2 seconds
      } else {
        setError(result.message || "Registration failed!");
        setSuccess("");
      }
    } catch (err) {
      console.error("Error registering:", err);
      setError("An error occurred. Please try again.");
      setSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="sin"
          placeholder="Social Insurance Number (SIN)"
          value={formData.sin}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;