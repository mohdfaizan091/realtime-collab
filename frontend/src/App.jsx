import { useEffect, useRef, useState } from "react";

const DOC_ID = "doc1";

function App() {
  const [content, setContent] = useState("");
  const socketRef = useRef(null);
  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    socketRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          docId: DOC_ID,
        })
      );
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "sync" || message.type === "update") {
        isRemoteUpdate.current = true;
        setContent(message.content);
      }
    };

    return () => ws.close();
  }, []);

  function handleChange(e) {
    const newValue = e.target.value;
    setContent(newValue);

    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    socketRef.current.send(
      JSON.stringify({
        type: "update",
        content: newValue,
      })
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Real-Time Collaborative Editor</h2>
      <textarea
        value={content}
        onChange={handleChange}
        rows={15}
        cols={80}
      />
    </div>
  );
}

export default App;
