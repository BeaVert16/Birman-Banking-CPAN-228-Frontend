import LoadingCat from "./LoadingCat/LoadingCat";

const LoadingErrorHandler = ({ loading, error, children }) => {
  if (loading) return <LoadingCat />;
  if (error) return <p className="error-message">{error}</p>;
  return children;
};

export default LoadingErrorHandler;
