import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { IsLoggedInContext } from "../../auth/IsLoggedInCheck";
import LoadingCat from "../../Global/LoadingCat/LoadingCat";
import { ipadd } from "../../url";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, checkAuth } = useContext(IsLoggedInContext);

  const [formData, setFormData] = useState({
    cardNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newErrors = {};
    if (!formData.cardNumber) {
      newErrors.cardNumber = "Card number is required.";
    } else if (!/^\d{16}$/.test(formData.cardNumber)) {
      newErrors.cardNumber = "Card number must be exactly 16 digits.";
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
      const response = await fetch(`${ipadd}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardNumber: parseInt(formData.cardNumber, 10),
          password: formData.password,
        }),
        credentials: "include",
      });
      const result = await response.json();
  
      if (response.ok) {
        console.log(result);
        await checkAuth();
        navigate("/");
      } else {
        console.error("Login failed:", result);
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
        <h1>Birman Bank</h1>
        <div className="image">
          <img className="logo" src="/Images/OGCatLong.png" alt="BongoCatto" />
        </div>
        <h3>Login</h3>
        <form onSubmit={handleSubmit} noValidate>
          <label>
            Card Number:
            <input
              name="cardNumber"
              type="text"
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
      </div>
    </div>
  );
};

export default LoginPage;