import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

const useTokenCheck = () => {
  const navigate = useNavigate();

  const getToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null;
    }
    return token;
  }, [navigate]); // <-- include navigate here

  return { getToken };
};

export default useTokenCheck;
