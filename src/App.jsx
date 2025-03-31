import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InterfaceOutput from "./Global/Bars/InterfaceOuput/InterfaceOuput";
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import IsLoggedInCheck from "./auth/IsLoggedInCheck";

const App = () => {
  return (
    <IsLoggedInCheck>
      <Router>
        <Routes>
          <Route path="/" element={<InterfaceOutput />}>
            <Route index element={<HomePage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
          </Route>
        </Routes>
      </Router>
    </IsLoggedInCheck>
  );
};

export default App;
