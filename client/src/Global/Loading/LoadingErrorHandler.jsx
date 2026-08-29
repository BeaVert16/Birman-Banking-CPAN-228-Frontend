import Loading from "./Loading";

const LoadingErrorHandler = ({ loading, error, children }) => {
  if (loading) return <Loading />;
  if (error) return <p className="error-message">{error}</p>;
  return children;
};

export default LoadingErrorHandler;

