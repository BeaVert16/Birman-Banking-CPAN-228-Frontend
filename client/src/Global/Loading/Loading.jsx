import "./Loading.css";

const Loading = ({ className = "", style }) => {
  return (
    <div className="loading-container">
      <div className={`spinner-border text-primary ${className}`} style={{ width: '4rem', height: '4rem', ...style }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
