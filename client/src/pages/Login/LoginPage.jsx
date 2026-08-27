import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IsLoggedInContext } from "../../auth/IsLoggedInCheck";
import { serverIpAddress } from "../../ServerIpAdd";
import useTokenCheck from "../../Global/hooks/useTokenCheck";
import fetchApi from "../../Global/Utils/fetchApi";
import LoadingCat from "../../Global/Loading/LoadingCat/LoadingCat";

import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { checkAuth } = useContext(IsLoggedInContext);
  const { getToken } = useTokenCheck();

  const [formData, setFormData] = useState({
    cardNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(""); // State specifically for login API errors
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
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

    e.preventDefault();
    setLoginError(""); // Clear previous login errors
    setErrors({}); // Clear validation errors

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // --- End Frontend Validation ---

    setIsLoading(true);

    try {
      const result = await fetchApi(
        `${serverIpAddress}/api/auth/login`,
        "POST",
        {
          cardNumber: formData.cardNumber,
          password: formData.password,
        }
      );

      console.log(result); // Debugging: Check the response structure

      localStorage.setItem("token", result.token);
      await checkAuth(); // Refresh auth context

      // Check the role property in the response
      if (result.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else {
        navigate("/account");
      }
    } catch (error) {
      setLoginError(error.message || "Network error or server unavailable.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="login-overlay">
      {isLoading && (
        <div className="loading-fullscreen">
          <LoadingCat />
        </div>
      )}
      <div className="login-container">
        <div className="image">
          <img
            className="logo"
            src="src/Images/BirmanBankLogo/Birmantext with icon.png"
            alt="BirmanIconWithText"
            onClick={() => navigate("/")}
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
        <div className="register-box">
          <h4>Don't have an account?</h4>
          <button onClick={handleRegisterClick} className="register-button">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
