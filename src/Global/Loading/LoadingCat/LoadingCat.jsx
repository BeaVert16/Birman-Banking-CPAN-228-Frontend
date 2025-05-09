import { useState, useEffect } from "react";
import "./LoadingCat.css";

const LoadingCat = ({ className, style }) => {
  const [showFirstImage, setShowFirstImage] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setShowFirstImage((prev) => !prev);
    }, 250);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="loading-container">
      <div className={`loading-cat ${className}`} style={style}>
        {showFirstImage ? (
          <img
            src="src/Images/Loading/CatHandsUp.png"
            className="login-animation-image"
          />
        ) : (
          <img
            src="src/Images/Loading/CatHandsSlap.png"
            className="login-animation-image"
          />
        )}
      </div>
    </div>
  );
};

export default LoadingCat;