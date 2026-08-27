import { useState, useEffect } from "react";
import { serverIpAddress } from "../../ServerIpAdd";
import { useNavigate } from "react-router-dom";

const useFetchAccounts = (user) => {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found.");
          return;
        }

        const response = await fetch(`${serverIpAddress}/api/accounts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          let errorMsg = `Error: ${response.status} ${response.statusText}`;
          try {
            const errorData = await response.json();
            errorMsg =
              errorData.message || JSON.stringify(errorData) || errorMsg;
          } catch (e) {
            console.error("Could not parse error response as JSON: " + e);
          }
          setError(errorMsg);
          return;
        }

        const data = await response.json();
        setAccounts(data);
      } catch (e) {
        if (e.message === "Unauthorized") {
          setError("Your session has expired. Please log in again.");
          navigate("/login");
        } else {
          console.error("Error fetching accounts:", error);
          setError("Failed to fetch accounts due to a network or server issue.");
        }
      }
    };

    if (user) {
      fetchAccounts();
    }
  }, [user]);

  return { accounts, error };
};

export default useFetchAccounts;
