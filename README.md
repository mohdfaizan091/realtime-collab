#  Real-Time Collaborative Editor (Server-Authoritative)

A real-time collaborative text editor built using **WebSockets** with a **server-authoritative state model**.  
Multiple users can edit the same document simultaneously and see updates live.

This project focuses on **correctness, consistency, and real-world behavior**, not feature overload.

---

##  What This Project Does

- Allows multiple clients to edit a shared document in real time
- Synchronizes document state through a central server
- Broadcasts updates only to users connected to the same document
- Handles disconnects, reconnects, and rapid edits gracefully

This is **not a chat app** and not a Google Docs clone.  
It is a **minimal collaborative system core**.

---

##  What This Project Does NOT Do

Intentionally out of scope:
- CRDT / Operational Transform
- Cursor syncing
- Rich text or formatting
- Authentication or permissions
- Persistence / database storage
- Offline editing

These were avoided to keep the focus on **real-time state synchronization fundamentals**.

---

##  Core Architecture

### 1. Server-Authoritative Model

The **server owns the document state**.

- Clients never directly modify shared state
- Clients send update events
- Server applies updates and broadcasts the latest state
- All clients re-render from server events

This prevents state divergence and simplifies consistency.

---

### 2. Room-Based Isolation

Each document maps to a **room**:

- Clients join a room when opening a document
- Updates are broadcast only within that room
- No cross-document leakage

This pattern scales naturally to multiple documents.

---

### 3. Consistency Model

**Last Write Wins (LWW)**

- Updates are applied in the order the server receives them
- Later updates overwrite earlier ones
- Deterministic and simple by design

This limitation is intentional and acknowledged.

---

## 🔄 Real-Time Update Flow

### When a client opens a document
1. Client connects via WebSocket
2. Client joins document room
3. Server sends current document state (`sync`)

### When a client edits
1. Client sends updated content
2. Server updates canonical document state
3. Server broadcasts update to room
4. All clients re-render

---

##  Frontend Synchronization Logic

The frontend editor handles two update sources:
1. Local user input
2. Remote server updates

To prevent infinite feedback loops:
- Server updates are marked and not re-sent
- User edits are **debounced** before sending

This ensures:
- Reduced network traffic
- Fewer overwrite conflicts
- Stable real-time UX

---

##  Failure Handling & Robustness

Handled explicitly:
- Connection status awareness (connected / disconnected)
- Graceful reconnect behavior
- Server-side message validation
- Safe cleanup on disconnect
- Large payload protection

Expected behavior:
- Server restart resets in-memory state
- Client refresh resyncs latest document

---


## 📡 Tech Stack

### Backend
- Node.js
- Express
- ws (WebSocket library)
- In-memory state management

### Frontend
- React (Vite)
- Native WebSocket API

No external real-time frameworks were used.

---

##  What This Project Demonstrates

- Real-time system design
- Server-authoritative state modeling
- Event-driven architecture
- Concurrency awareness
- Frontend–backend synchronization
- Handling failure modes explicitly

This project answers:
> “How do collaborative systems keep users in sync?”

---

##  Final Note

This project is **intentionally frozen**.

It serves as a **clean reference implementation** of a real-time collaborative system core, focusing on correctness and explainability over features.

---




