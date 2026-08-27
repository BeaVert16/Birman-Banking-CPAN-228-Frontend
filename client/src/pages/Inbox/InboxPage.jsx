import React, { useState, useEffect } from "react";
import { serverIpAddress } from "../../ServerIpAdd";
import useTokenCheck from "../../Global/hooks/useTokenCheck";
import fetchApi from "../../Global/Utils/fetchApi";
import LoadingErrorHandler from "../../Global/Loading/LoadingErrorHandler";
import "./InboxPage.css";

const InboxPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage] = useState("");
  const { getToken } = useTokenCheck();

  useEffect(() => {
    const fetchInboxMessages = async () => {
      setLoading(true);
      setError("");
      try {
        const token = getToken();
        if (!token) return;

        const data = await fetchApi(
          `${serverIpAddress}/api/clients/inbox`,
          "GET",
          null,
          token
        );
        setMessages(data);
      } catch (e) {
        setError("A network error occurred: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInboxMessages();
  }, [getToken]);

  return (
    <div className="inbox-page">
      <h2>Inbox Messages</h2>
      <LoadingErrorHandler loading={loading} error={error}>
        {actionMessage && <p className="success-message">{actionMessage}</p>}
        {messages.length === 0 ? (
          <p>No messages found in your inbox.</p>
        ) : (
          <ul className="inbox-messages-list">
            {messages.map((message, index) => (
              <li key={message.id || index} className="inbox-message-item">
                <h3>{message.subject}</h3>
                <p>{message.body}</p>
                <p className="message-date">
                  Received on: {new Date(message.timestamp).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </LoadingErrorHandler>
    </div>
  );
};

export default InboxPage;
