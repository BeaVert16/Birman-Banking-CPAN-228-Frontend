import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IsLoggedInContext } from "../../auth/IsLoggedInCheck";
import { serverIpAddress } from "../../ServerIpAdd";

import "./LoginPage.css";
import LoadingCat from "../../Global/LoadingCat/LoadingCat";

const LoginPage = () => {
  const navigate = useNavigate();
  const { checkAuth } = useContext(IsLoggedInContext);

  const [formData, setFormData] = useState({
    cardNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(""); // State specifically for login API errors
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/account");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginError(""); // Clear login error on input change
    setErrors((prev) => ({ ...prev, [name]: undefined })); // Clear specific field validation error

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
    setLoginError(""); // Clear previous login errors
    setErrors({}); // Clear validation errors

    // --- Frontend Validation ---
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
    // --- End Frontend Validation ---

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

      // --- Check if the response status indicates success ---
      if (response.ok) {
        const result = await response.json(); // Only parse JSON if response is OK
        localStorage.setItem("token", result.token);
        await checkAuth(); // Refresh auth context
        navigate("/account"); // Navigate on successful login
      } else {
        // --- Handle non-OK responses (like 401 Unauthorized) ---
        let errorMessage = `Login failed with status: ${response.status}`;
        try {
          // Try to get more specific error message from backend response body
          const errorResult = await response.json(); // Try parsing as JSON first
          errorMessage =
            errorResult.message ||
            errorResult.error ||
            JSON.stringify(errorResult);
        } catch (e) {
          console.error("Failed to parse error response as JSON:", e);
          try {
            const errorText = await response.text();
            if (errorText) {
              errorMessage = errorText;
            }
          } catch (e) {
            console.error("Failed to read error response as text:", e);
          }
        }
        console.error("Login failed:", errorMessage);
        setLoginError(errorMessage); // Set the specific login error state
      }
    } catch (error) {
      // --- Handle network errors or other exceptions during fetch ---
      console.error("Error logging in:", error);
      setLoginError("Network error or server unavailable. Please try again."); // Set a generic error
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
            {loginError && (
              <div style={{ marginTop: "10px", textAlign: "center" }}>
                <span className="error-box">{loginError}</span>
              </div>
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
