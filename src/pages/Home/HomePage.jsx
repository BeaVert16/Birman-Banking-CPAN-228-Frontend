import "./HomePage.css";
import "../../App.css";
import HomeBar from "../../Global/Bars/HomeBar/HomeBar";

const HomePage = () => {
  return (
    <div>
      <HomeBar/>
      <a href="/Login" className="register-button">
        <button>Login</button>
      </a>
      <h4>Don't have an account?</h4>
      <a href="/register" className="register-button">
        <button>Register</button>
      </a>
    </div>
  );
};

export default HomePage;
