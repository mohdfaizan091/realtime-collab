const rooms = new Map();


function joinRoom(docId, ws) {
  if (!rooms.has(docId)) {
    rooms.set(docId, new Set());
  }
  rooms.get(docId).add(ws);
}

function leaveRoom(docId, ws) {
  if (!rooms.has(docId)) return;
  rooms.get(docId).delete(ws);
  if (rooms.get(docId).size === 0) {
    rooms.delete(docId);
  }
}

function broadcast(docId, message) {
  if (!rooms.has(docId)) return;
  for (const client of rooms.get(docId)) {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(message));
    }
  }
}

module.exports = {
  joinRoom,
  leaveRoom,
  broadcast,
};
