import "./ProgressBar.css";
import birmanIcon from "../../../Images/BirmanBankLogo/BirmanIcon.png";

const ProgressBar = ({ step }) => {
  const totalSteps = 4; // Total number of steps in the registration process
  const progressPercentage = (step / totalSteps) * 100;

  return (
    <div className="progressBar">
      <img
        className="progressBar-logo"
        src={birmanIcon}
        alt="BirmanIconWithText"
      />
      <a href="/">
        <div className="title">BIRMAN BANKING</div>
      </a>
      <div className="progress-indicator">
        <div
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
