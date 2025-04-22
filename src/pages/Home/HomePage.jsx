import "./HomePage.css";
import "../../App.css";
import HomeBar from "../../Global/Bars/HomeBar/HomeBar";
import BirmanIcon from "../../Images/BirmanBankLogo/BirmanIcon.png";
import BirmanText from "../../Images/BirmanBankLogo/BirmanText.png";

const HomePage = () => {
  return (
    <div className="home-page">
      <HomeBar />
      <div className="welcome-message">
        <h1>Welcome to Birman Banking</h1>
        <p>Your trusted partner in secure, modern web banking.</p>

        <img src={BirmanIcon} alt="Birman Bank Logo" className="home-logo" />

        <section className="welcome-message">
          <h2>About the Application</h2>
          <p>
            This is an online web banking application concept, designed to provide users with a secure and user-friendly platform for managing their finances. Birman Banking is built using modern web technologies, such as Spring, React, MongoDB, Bootstrap, and more, ensuring a responsive and intuitive experience across devices.
          </p>
          <p>
            Users can register and then sign in to access their accounts and perform various banking functions such as transfers, balance control, and credit management.
          </p>
          <p>
            Birman Banking takes user security very seriously, and includes strong protection measures in order to keep your data private. This is done by employing industry-standard encryption within our back-end operations, ensuring all keys used by developers are securely managed through environment variables, and including scam-prevention measures in our front-end. These methods ensure that users stay safe, and their data stays private.
          </p>
        </section>

        <section className="welcome-message">
          <h2>Key Features</h2>
          <ul className="feature-list">
            <li><strong>Transaction History</strong>: All transactions are logged for easy review.</li>
            <li><strong>Notification Inbox</strong>: Users can view past alerts and system messages.</li>
            <li><strong>Credit & Loan System</strong>: Users can apply for loans, with applications being reviewed by our admins through our approval process.</li>
            <li><strong>Full-Stack Setup</strong>: Front-end, back-end, and database initialized and connected.</li>
            <li><strong>Account Management</strong>: Multiple balance account types can be created.</li>
            <li><strong>Admin Interface</strong>: Administrators can review loans and manage users through a specialized dashboard.</li>
            <li><strong>E-Transfer Capability</strong>: Users can securely send and receive money.</li>
            <li><strong>Balance Management</strong>: Users can deposit and withdraw from their accounts.</li>
            <li><strong>Data Security</strong>: Sensitive data is protected with environment-based configuration and encryption.</li>

          </ul>
        </section>

        <section className="welcome-message">
          <p>Ready to start banking with us?</p>
          <p><strong><a href="/register">Register an account today!</a></strong></p>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
