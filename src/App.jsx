import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InterfaceOutput from "./Global/Bars/InterfaceOuput/InterfaceOuput";
import IsLoggedInCheck from "./auth/IsLoggedInCheck";

import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import AboutPage from "./pages/About/AboutPage";
import PageNotFound from "./pages/Error/PageNotFound";
import AccountPage from "./pages/Account/AccountPage";
import RouteProtector from "./auth/RouteProtector";
import AccountDetails from "./pages/Account/AccountDetails/AccountDetails";
import E_TransferPage from "./pages/Transactions/E-Transfer/E_TransferPage";
import DepositPage from "./pages/Transactions/Deposit/DepositPage";
import AddAccountPage from "./pages/Account/AddAccount/AddAccountPage";

const App = () => {
  return (
    <IsLoggedInCheck>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route path="/" element={<InterfaceOutput />}>
            <Route path="account" element={<RouteProtector><AccountPage /></RouteProtector>} />
            <Route path="account/:accountId/edit" element={<RouteProtector><AddAccountPage /></RouteProtector>} />
            <Route path="account/:accountId/details" element={<RouteProtector><AccountDetails /></RouteProtector>} />
            <Route path="e-transfer" element={<RouteProtector><E_TransferPage /></RouteProtector>} />
            <Route path="deposit" element={<RouteProtector><DepositPage /></RouteProtector>} />
            <Route path="account/create" element={<RouteProtector><AddAccountPage /></RouteProtector>} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </IsLoggedInCheck>
  );
};

export default App;
