const WebSocket = require("ws");
const { joinRoom, leaveRoom, broadcast } = require("./rooms/room.manager");
const { getDocument, updateDocument } = require("./models/document.store");

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    let currentDocId = null;

    ws.on("message", (data) => {
      const message = JSON.parse(data);

      if (message.type === "join") {
        currentDocId = message.docId;
        joinRoom(currentDocId, ws);

        const doc = getDocument(currentDocId);
        ws.send(
          JSON.stringify({
            type: "sync",
            content: doc.content,
          })
        );
      }

      if (message.type === "update") {
        if (!currentDocId) return;

        const updatedDoc = updateDocument(
          currentDocId,
          message.content
        );

        broadcast(currentDocId, {
          type: "update",
          content: updatedDoc.content,
        });
      }
    });

    ws.on("close", () => {
      if (currentDocId) {
        leaveRoom(currentDocId, ws);
      }
    });
  });
}

module.exports = setupWebSocket;
