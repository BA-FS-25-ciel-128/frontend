import { createContext, useContext, useEffect, useState } from "react";
import { userData } from "three/examples/jsm/nodes/Nodes.js";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);

  // Hinzufügen einer Funktion zum Zurücksetzen des Fehlers
  const clearError = () => {
    setError(null);
  };

  const chat = async (message) => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      // Prüfen, ob es sich um eine Fehlerantwort handelt
      if (data.status && data.status === "error") {
        console.error("Backend-Fehler:", data.message);
        setError(data.message);
      } else {
        const resp = data.messages;
        setMessages((messages) => [...messages, ...resp]);
      }
    } catch (e) {
      // Hier fängst du Client-seitige Fehler ab (z.B. Netzwerkprobleme)
      console.error("Fehler bei der Anfrage:", e);
      setError("Verbindungsproblem: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
        error,
        clearError
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};