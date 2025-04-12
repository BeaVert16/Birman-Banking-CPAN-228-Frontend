import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IsLoggedInContext } from "../../auth/IsLoggedInCheck";
import { serverIpAddress } from "../../ServerIpAdd";

import "./LoginPage.css"
import LoadingCat from "../../Global/LoadingCat/LoadingCat";

const LoginPage = () => {
  const navigate = useNavigate();
  const { checkAuth } = useContext(IsLoggedInContext);

  const [formData, setFormData] = useState({
    cardNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 16) {
        setFormData({ ...formData, [name]: numericValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.cardNumber) {
      newErrors.cardNumber = "Card number is required.";
    } else if (!/^\d{16}$/.test(formData.cardNumber)) {
      newErrors.cardNumber = "Card number must be 16 digits.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${serverIpAddress}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardNumber: formData.cardNumber,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token);
        await checkAuth();
        navigate("/account");
      } else {
        alert(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-container">
        <div className="image">
          <img
            className="logo"
            src="Images/BirmanBankLogo/Birmantext with icon.png"
            alt="BirmanIconWithText"
          />
        </div>
        <h3>Login</h3>
        <form onSubmit={handleSubmit} noValidate>
          <label>
            Card Number:
            <input
              name="cardNumber"
              type="text"
              inputMode="numeric"
              maxLength="16"
              pattern="\d{16}"
              placeholder="Enter your card number"
              value={formData.cardNumber}
              onChange={handleChange}
              required
            />
            {errors.cardNumber && (
              <span className="error-box">{errors.cardNumber}</span>
            )}
          </label>
          <label>
            Password:
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <span className="error-box">{errors.password}</span>
            )}
          </label>
          <button type="submit" className="login" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        {isLoading && (
          <div className="loading-overlay">
            <LoadingCat />
          </div>
        )}
        <div className="register-box">
          <h4>Don't have an account?</h4>
          <a href="/register" className="register-button">
            <button>Register</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
