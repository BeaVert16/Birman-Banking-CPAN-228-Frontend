import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InterfaceOutput from "./Global/Bars/InterfaceOuput/InterfaceOuput";
import IsLoggedInCheck from "./auth/IsLoggedInCheck";

import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import AboutPage from "./pages/About/AboutPage";
import PageNotFound from "./pages/Error/PageNotFound";

const App = () => {
  return (
    <IsLoggedInCheck>
      <Router>
        <Routes>
          <Route path="/" element={<InterfaceOutput />}>
            <Route index element={<HomePage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </IsLoggedInCheck>
  );
};

export default App;