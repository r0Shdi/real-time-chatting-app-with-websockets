import { useEffect, useState } from "react";

const SOCKET_URL = "ws://localhost:8080";

export const useWebSocket = (userId: string) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);

  useEffect(() => {
    if (!userId) return;

    const socket =  new WebSocket(SOCKET_URL)
    socket.onopen = () => {
        console.log("Connected to WebSocket");
        setWs(socket); // ✅ Store WebSocket only after connection is established
      };
  
  
    
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    
    socket.onerror = (error) => console.error("WebSocket error:", error);
    socket.onclose = () => console.log("WebSocket closed");

    return () => {
      socket.close(); // ✅ Close WebSocket when component unmounts
    };
  }, [userId]);

  const sendMessage = (text: string) => {
    if (!ws) {
      console.error("WebSocket is not initialized yet!");
      return;
    }

    if (ws.readyState === WebSocket.OPEN) {
      console.log("Sending message:", text);
      ws.send(JSON.stringify({ senderId: userId, to: "ham", message: text }));
    } else {
      console.error("WebSocket is not open!");
    }
  };

  return { messages, sendMessage };
};