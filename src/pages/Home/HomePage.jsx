import { useState, useEffect, useContext } from "react";
import "./HomePage.css";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import { IsLoggedInContext } from "../../auth/IsLoggedInCheck"; // Import the context, not the component

const HomePage = () => {
  const { isAuthenticated, logout } = useContext(IsLoggedInContext); // Use the context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the logout function
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div>
      <h1 className="page-title">Accounts</h1>
      <div>
        <div className="card">
          <h2>Account 1</h2>
          <p>Account details go here...</p>
        </div>
        <div className="card">
          <h2>Account 2</h2>
          <p>Account details go here...</p>
        </div>
        <div className="card">
          <h2>Account 3</h2>
          <p>Account details go here...</p>
        </div>
        <nav>
          <h1>Birman Bank</h1>
            <button onClick={handleLogout}>Logout</button>
        </nav>
      </div>
    </div>
  );
};

export default HomePage;