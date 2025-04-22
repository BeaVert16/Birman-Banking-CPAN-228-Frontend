import "../../App.css";
import "./PageNotFound.css";
import HomeBar from "../../Global/Bars/HomeBar/HomeBar";

const PageNotFound = () => {
  return (
    <div className="page-not-found">
      <HomeBar />
      <div className="page-not-found-content">
        <div className="error-message">
          <h1>Error 404</h1>
          <p>Page not found.</p>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;