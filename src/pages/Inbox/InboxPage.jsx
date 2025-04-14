import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serverIpAddress } from "../../ServerIpAdd";
import "./InboxPage.css";

const InboxPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInboxMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found.");
          navigate("/login");
          return;
        }

        const response = await fetch(`${serverIpAddress}/api/clients/inbox`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError("Failed to fetch inbox messages.");
          if (response.status === 401) {
            navigate("/login");
          }
          return;
        }

        const data = await response.json();
        setMessages(data);
      } catch (e) {
        setError("A network error occurred: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInboxMessages();
  }, [navigate]);

  // const handleAction = async (messageId, action) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       setError("Authentication token not found.");
  //       navigate("/login");
  //       return;
  //     }

  //     const response = await fetch(
  //       `${serverIpAddress}/api/admin/inbox/${messageId}/${action}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => null);
  //       setError(errorData?.message || "Failed to process the action.");
  //       return;
  //     }

  //     setActionMessage(
  //       `Message ${action === "accept" ? "accepted" : "denied"} successfully.`
  //     );
  //     setMessages((prevMessages) =>
  //       prevMessages.filter((message) => message.id !== messageId)
  //     );
  //   } catch (e) {
  //     setError("A network error occurred: " + e.message);
  //   }
  // };

  return (
    <div className="inbox-page">
      <h2>Inbox Messages</h2>
      {loading && <p>Loading messages...</p>}
      {error && <p className="error-message">{error}</p>}
      {actionMessage && <p className="success-message">{actionMessage}</p>}
      {!loading && !error && messages.length === 0 && (
        <p>No messages found in your inbox.</p>
      )}
      {!loading && !error && messages.length > 0 && (
        <ul className="inbox-messages-list">
          {messages.map((message, index) => (
            <li key={message.id || index} className="inbox-message-item">
              <h3>{message.subject}</h3>
              <p>{message.body}</p>
              <p className="message-date">
                Received on: {new Date(message.timestamp).toLocaleString()}
              </p>
              {/* <div className="message-actions">
                <button
                  onClick={() => handleAction(message.messageId, "accept")}
                  className="accept-button"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAction(message.messageId, "deny")}
                  className="deny-button"
                >
                  Deny
                </button>
              </div> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InboxPage;
