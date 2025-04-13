import { createContext, useState, useEffect } from "react";
import LoadingCat from "../Global/LoadingCat/LoadingCat";
import { serverIpAddress } from "../ServerIpAdd";

export const IsLoggedInContext = createContext();

const IsLoggedInCheck = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${serverIpAddress}/api/auth/session-check`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setIsAuthenticated(result.isAuthenticated);
        setUser(result.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <IsLoggedInContext.Provider
      value={{ isAuthenticated, user, checkAuth, logout }}
    >
      {loading ? <LoadingCat /> : children}
    </IsLoggedInContext.Provider>
  );
};

export default IsLoggedInCheck;