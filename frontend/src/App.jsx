import { useEffect, useRef, useState } from "react";

const DOC_ID = "doc1";

function App() {
  const [status, setStatus] = useState("connecting");
  const [content, setContent] = useState("");

  const socketRef = useRef(null);
  const isRemoteUpdate = useRef(false);
  const debounceTimer = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    socketRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
      ws.send(
        JSON.stringify({
          type: "join",
          docId: DOC_ID,
        })
      );
    };

    ws.onclose = () => {
      setStatus("disconnected");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "sync" || message.type === "update") {
        isRemoteUpdate.current = true;
        setContent(message.content);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  function handleChange(e) {
    const newValue = e.target.value;
    setContent(newValue);

    // Prevent echo loop
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    // Debounce updates (Phase 3 requirement)
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: "update",
            content: newValue,
          })
        );
      }
    }, 300);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Real-Time Collaborative Editor</h2>

      <p>
        Status:{" "}
        <strong
          style={{
            color:
              status === "connected"
                ? "green"
                : status === "connecting"
                ? "orange"
                : "red",
          }}
        >
          {status}
        </strong>
      </p>

      <textarea
        value={content}
        onChange={handleChange}
        rows={15}
        cols={80}
        style={{ width: "100%", fontSize: 16 }}
      />
    </div>
  );
}

export default App;
