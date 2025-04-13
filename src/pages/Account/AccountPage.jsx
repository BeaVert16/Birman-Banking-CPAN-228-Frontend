import { useContext } from "react";
import "./AccountPage.css";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import { IsLoggedInContext } from "../../auth/IsLoggedInCheck";

const AccountPage = () => {
  const { isAuthenticated, logout } = useContext(IsLoggedInContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="account-page">
      <section className="account-list">
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
      </section>

      <footer className="account-footer">
        <h1>Birman Bank</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </footer>
    </div>
  );
};

export default AccountPage;