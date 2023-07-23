import { useEffect, useState } from "react";
import socketClient from "socket.io-client";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  //once app is loaded
  useEffect(() => {
    // const socket = socketClient("http://localhost:5000");
    const socket = socketClient("https://chatappapi-8ln1.onrender.com");

    setSocket(socket);

    // Prompt the user to enter their username when connecting
    const user = prompt("Please enter your username:");
    setUsername(user);
    socket.emit("join", user);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("message", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });
    }
  }, [socket]);

  const sendmessage = (e) => {
    e.preventDefault();
    if (socket) {
      const messageData = { username, message };
      socket.emit("message", messageData);
      setMessage("");
    }
  };

  return (
    <>
      <h1>CHAT APP</h1>
      <div className="app">
        <div className="chat-window">
          {messages.map((msg) => (
            <div>
              {msg.username === username ? (
                <p key={msg.messageId} className="outgoing">
                  {username} : {msg.message}
                </p>
              ) : (
                <p key={msg.messageId} className="incoming">
                  {msg.username} : {msg.message}
                </p>
              )}
            </div>
          ))}
        </div>
        <div>
          <form onSubmit={sendmessage}>
            <input
              type="text"
              placeholder="User name..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <textarea
              type="text"
              placeholder=" Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
