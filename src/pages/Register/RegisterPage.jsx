import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverIpAddress } from "../../ServerIpAdd";
import ProgressBar from "./ProgressBar/ProgressBar"; 
import "./RegisterPage.css";

const provinces = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Nova Scotia",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
];

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    sin: "",
    address: "",
    city: "",
    postalCode: "",
    additionalInfo: "",
    province: "",
    country: "Canada",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required.";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required.";
      if (!formData.dateOfBirth.trim())
        newErrors.dateOfBirth = "Date of birth is required.";
      if (!formData.sin.trim() || formData.sin.length !== 9)
        newErrors.sin = "SIN must be 9 digits.";
    } else if (step === 2) {
      if (!formData.address.trim()) newErrors.address = "Address is required.";
      if (!formData.city.trim()) newErrors.city = "City is required.";
      if (!formData.postalCode.trim())
        newErrors.postalCode = "Postal code is required.";
      if (!formData.province.trim())
        newErrors.province = "Province is required.";
    } else if (step === 3) {
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Valid email is required.";
      if (!formData.phoneNumber.trim())
        newErrors.phoneNumber = "Phone number is required.";
    }
    return newErrors;
  };

  const handleNext = () => {
    const validationErrors = validateStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (step < 4) {
      setErrors({});
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await fetch(`${serverIpAddress}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(
          `Registration successful! Your card number is: ${result.cardNumber}`
        );
        setStep(5); // Move to Step 5 to display the server response
        setTimeout(() => navigate("/login"), 5000); // Redirect to login after 5 seconds
      } else {
        setMessage(result.message || "Registration failed. Please try again.");
        setStep(5); // Move to Step 5 even for errors
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage("An error occurred. Please try again.");
      setStep(5); // Move to Step 5 even for errors
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="progress-bar-wrapper">
        <ProgressBar step={step} />
      </div>

      <div className="register-overlay">
        <div className="register-container">
          <h3>Register</h3>
          <form className="register-form" onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <div className="form-group">
                  <label htmlFor="firstName">Legal First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your Legal First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    aria-label="First Name"
                    required
                  />
                  {errors.firstName && (
                    <span className="error-box">{errors.firstName}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Legal Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter your Legal Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    aria-label="Last Name"
                    required
                  />
                  {errors.lastName && (
                    <span className="error-box">{errors.lastName}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    aria-label="Date of Birth"
                    required
                  />
                  {errors.dateOfBirth && (
                    <span className="error-box">{errors.dateOfBirth}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="sin">SIN</label>
                  <input
                    type="text"
                    id="sin"
                    name="sin"
                    value={formData.sin}
                    onChange={handleChange}
                    aria-label="Social Insurance Number"
                    required
                  />
                  {errors.sin && (
                    <span className="error-box">{errors.sin}</span>
                  )}
                </div>
                <button type="button" onClick={handleNext}>
                  Next
                </button>
              </>
            )}
            {step === 2 && (
              <>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    aria-label="Address"
                    required
                  />
                  {errors.address && (
                    <span className="error-box">{errors.address}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    aria-label="City"
                    required
                  />
                  {errors.city && (
                    <span className="error-box">{errors.city}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    aria-label="Postal Code"
                    required
                  />
                  {errors.postalCode && (
                    <span className="error-box">{errors.postalCode}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="province">Province</label>
                  <select
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    aria-label="Province"
                    required
                  >
                    <option value="">Select a province</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                  {errors.province && (
                    <span className="error-box">{errors.province}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    disabled
                  >
                    <option value="Canada">Canada</option>
                  </select>
                </div>
                <button type="button" onClick={handleBack}>
                  Back
                </button>
                <button type="button" onClick={handleNext}>
                  Next
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-label="Email"
                    required
                  />
                  {errors.email && (
                    <span className="error-box">{errors.email}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    aria-label="Phone Number"
                    required
                  />
                  {errors.phoneNumber && (
                    <span className="error-box">{errors.phoneNumber}</span>
                  )}
                </div>
                <button type="button" className="register" onClick={handleBack}>
                  Back
                </button>
                <button type="button" onClick={handleNext}>
                  Next
                </button>
              </>
            )}

            {step === 4 && (
              <>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    aria-label="Password"
                    required
                  />
                  {errors.password && (
                    <span className="error-box">{errors.password}</span>
                  )}
                </div>
                <button type="button" onClick={handleBack}>
                  Back
                </button>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Register"}
                </button>
              </>
            )}
          </form>
          {message && <span className="register-message">{message}</span>}
        </div>
      </div>
    </div>
  );
};

export default Register;
