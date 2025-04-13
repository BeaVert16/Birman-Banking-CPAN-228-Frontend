import "./HomePage.css";
import "../../App.css";
import HomeBar from "../../Global/Bars/HomeBar/HomeBar";

const HomePage = () => {
  return (
    <div className="home-page">
      <HomeBar />
      <div className="welcome-message">
        <h1>Welcome to Birman Bank</h1>
        <p>Your trusted partner in banking.</p>
      </div>
    </div>
  );
};

export default HomePage;
