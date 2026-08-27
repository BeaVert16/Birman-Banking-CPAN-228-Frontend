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
import InternalTransferPage from "./pages/Transactions/InternalTransfer/InternalTransferPage";

import AdminDashboardTemplate from "./Admin/AdminDashboardTemplate";
import AdminDashboard from "./Admin/AdminDashboard/AdminDashboard";
import Transactions from "./Admin/Transactions/Transactions";
import Clients from "./Admin/Clients/Clients";
import Accounts from "./Admin/Accounts/Accounts";
import Users from "./Admin/Users/User";
import AddAccountAdmin from "./Admin/Accounts/options/AddAccountAdmin";
import InboxPage from "./pages/Inbox/InboxPage";
import CreditPage from "./pages/Transactions/Credit/CreditPage";
import Loans from "./Admin/Loans/Loans";
import AddAdmin from "./Admin/AddAdmin/AddAdmin";
import AddClientAdmin from "./Admin/Clients/options/AddClientAdmin";
import EditClient from "./Admin/Clients/options/EditClient";
import ViewClient from "./Admin/Clients/options/ViewClient";

const App = () => {
  return (
    <IsLoggedInCheck>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* anything above here will be rendered without the overlays */}

          {/* anything inside this interface will be rendered with the overlays */}
          <Route path="/" element={<InterfaceOutput />}>
            {/* Admin pages */}
            <Route
              path="admin-dashboard"
              element={
                <RouteProtector requiredRole="ADMIN">
                  <AdminDashboardTemplate />
                </RouteProtector>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route
                path="transactions"
                element={
                  <RouteProtector requiredRole="ADMIN">
                    <Transactions />
                  </RouteProtector>
                }
              />
              <Route
                path="clients"
                element={
                  <RouteProtector requiredRole="ADMIN">
                    <Clients />
                  </RouteProtector>
                }
              />
              <Route
                path="loans"
                element={
                  <RouteProtector requiredRole="ADMIN">
                    <Loans />
                  </RouteProtector>
                }
              />
              <Route
                path="accounts"
                element={
                  <RouteProtector requiredRole="ADMIN">
                    <Accounts />
                  </RouteProtector>
                }
              />
              <Route
                path="accounts/add"
                element={
                  <RouteProtector requiredRole="ADMIN">
                    <AddAccountAdmin />
                  </RouteProtector>
                }
              />
              <Route
                path="accounts/:accountId/edit"
                element={
                  <RouteProtector requiredRole="ADMIN">
                    <AddAccountAdmin />
                  </RouteProtector>
                }
              />
              <Route
                path="users"
                element={
                  <RouteProtector requiredRole="ADMIN">
                    <Users />
                  </RouteProtector>
                }
              />
              <Route
                path="admin-dashboard/add-admin"
                element={
                  <RouteProtector requiredRole="ADMIN">
                    <AddAdmin />
                  </RouteProtector>
                }
              />
              <Route
                path="admin-dashboard/clients/add"
                element={
                  <RouteProtector requiredRole="ADMIN">
                    <AddClientAdmin />
                  </RouteProtector>
                }
              />
              <Route
                path="admin-dashboard/clients/:clientId/edit"
                element={
                  <RouteProtector requiredRole="ADMIN">
                    <EditClient />
                  </RouteProtector>
                }
              />
              <Route
                path="admin-dashboard/clients/:clientId/view"
                element={
                  <RouteProtector requiredRole="ADMIN">
                    <ViewClient />
                  </RouteProtector>
                }
              />
            </Route>

            {/* Client pages */}
            <Route path="inbox" element={<InboxPage />} />
            <Route
              path="account"
              element={
                <RouteProtector>
                  <AccountPage />
                </RouteProtector>
              }
            />
            <Route
              path="account/:accountId/edit"
              element={
                <RouteProtector>
                  <AddAccountPage />
                </RouteProtector>
              }
            />
            <Route
              path="account/:accountId/details"
              element={
                <RouteProtector>
                  <AccountDetails />
                </RouteProtector>
              }
            />
            <Route
              path="e-transfer"
              element={
                <RouteProtector>
                  <E_TransferPage />
                </RouteProtector>
              }
            />
            <Route
              path="deposit"
              element={
                <RouteProtector>
                  <DepositPage />
                </RouteProtector>
              }
            />
            <Route
              path="credit"
              element={
                <RouteProtector>
                  <CreditPage />
                </RouteProtector>
              }
            />
            <Route
              path="account/create"
              element={
                <RouteProtector>
                  <AddAccountPage />
                </RouteProtector>
              }
            />
            <Route
              path="internal-transfer"
              element={
                <RouteProtector>
                  <InternalTransferPage />
                </RouteProtector>
              }
            />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </IsLoggedInCheck>
  );
};

export default App;
