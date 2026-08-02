# Chat & Socket.IO Integration Guide

## Overview

The chat system uses **Socket.IO** for real-time delivery with a **REST polling fallback** (every 4 s) in case the backend is not broadcasting socket events. Messages are **sent via REST POST** — never via socket emit.

---

## File Structure

```
src/
├── services/
│   ├── socket.js          ← Singleton Socket.IO client
│   └── httpEndpoint.js    ← All API endpoints including CHAT.*
├── hooks/
│   └── useSocket.js       ← React hook — connect, join room, handle events
├── components/
│   └── chat/
│       └── ChatPanel.jsx  ← Full chat UI (sidebar + messages + input)
└── pages/
    ├── Chat.jsx               ← Public chat  → role="user"
    └── admin/
        └── Messages.jsx       ← Admin inbox  → role="admin"
```

---

## Environment Setup

`.env` / `.env.development`:

```
REACT_APP_SOCKET_URL=https://your-backend.com
```

> **This project uses Webpack — always use `REACT_APP_` prefix, never `VITE_`.**

---

## API Endpoints (`src/services/httpEndpoint.js`)

| Key                     | Method | URL                               | Purpose                                 |
| ----------------------- | ------ | --------------------------------- | --------------------------------------- |
| `CHAT.ROOM`             | POST   | `/api/v1/chat/room`               | User: create or get own room with admin |
| `CHAT.ROOMS`            | GET    | `/api/v1/chat/rooms`              | Admin: list all rooms                   |
| `CHAT.MESSAGES(id)`     | GET    | `/api/v1/chat/rooms/:id/messages` | Load message history                    |
| `CHAT.SEND_MESSAGE(id)` | POST   | `/api/v1/chat/rooms/:id/messages` | Send message `{ content }`              |
| `CHAT.MARK_READ(id)`    | PUT    | `/api/v1/chat/rooms/:id/read`     | Mark all messages as read               |

---

## Socket Events

### Client → Server (emit)

| Event                | Payload                   | When                               |
| -------------------- | ------------------------- | ---------------------------------- |
| `conversation:join`  | `conversationId` (string) | On connect and on room switch      |
| `conversation:leave` | `conversationId` (string) | On room switch or unmount          |
| `typing:start`       | `{ conversationId }`      | User starts typing                 |
| `typing:stop`        | `{ conversationId }`      | User stops typing (1.5 s debounce) |

### Server → Client (listen)

| Event          | Payload                       | Action                                        |
| -------------- | ----------------------------- | --------------------------------------------- |
| `message:new`  | `{ conversationId, message }` | Append message to active room, update sidebar |
| `message:read` | `{ conversationId, readBy }`  | Mark messages as read                         |
| `user:online`  | `{ userId }`                  | Show green dot on sidebar                     |
| `user:offline` | `{ userId }`                  | Show gray dot on sidebar                      |

---

## `src/services/socket.js`

Single exported `socket` instance. `autoConnect: false` means it does **not** connect on import — connection is triggered manually inside `useSocket` after the auth token is available.

```js
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
  withCredentials: true,
});
```

> Never create `io()` inside a component. One instance for the whole app.

---

## `src/hooks/useSocket.js`

### What it does

1. Reads `token` from `localStorage` (stored by the authSlice listener middleware under the key `token`)
2. Sets `socket.auth = { token }` then calls `socket.connect()`
3. Registers all event listeners
4. Emits `conversation:join` for the active room
5. On cleanup: emits `conversation:leave`, removes all listeners

### Key design decisions

**Ref pattern for callbacks**

```js
const onMessageRef = useRef(onMessage);
onMessageRef.current = onMessage; // updated every render
```

Callbacks are stored in refs so the `useEffect` deps array only needs `[conversationId]`. Without this, adding callbacks to deps causes the socket to leave and rejoin the room on every render.

**Race condition prevention**

```js
socket.on("connect", handleConnect); // register FIRST
socket.connect(); // then connect
```

If you call `socket.connect()` before registering the `connect` listener, the event fires before the handler is attached — the room join is missed.

**Usage**

```js
const { sendTyping, isConnected } = useSocket({
  conversationId: activeRoomId,
  onMessage: handleSocketMessage,
  onTypingStart: handleTypingStart,
  onTypingStop: handleTypingStop,
  onUserOnline: handleUserOnline,
  onUserOffline: handleUserOffline,
});
```

---

## `src/components/chat/ChatPanel.jsx`

### Props

| Prop        | Type                | Default  | Description                                |
| ----------- | ------------------- | -------- | ------------------------------------------ |
| `role`      | `'user' \| 'admin'` | `'user'` | Controls room loading strategy             |
| `className` | string              | `""`     | Extra CSS classes (e.g. height constraint) |
| `style`     | object              | —        | Inline styles                              |

### Role behaviour

| Role    | On mount                                     | Rooms shown |
| ------- | -------------------------------------------- | ----------- |
| `user`  | POST `/chat/room` — creates or gets own room | 1 room      |
| `admin` | GET `/chat/rooms` — fetches all rooms        | All rooms   |

### Admin multi-room subscription

The admin must receive messages from **all** rooms, not just the active one. `useSocket` only joins `conversationId` (active room), so the panel explicitly joins all rooms:

```js
const adminRoomIdsRef = useRef(new Set());

// On rooms load — join every room immediately
normalized.forEach((r) => {
  adminRoomIdsRef.current.add(String(r.id));
  socket.emit("conversation:join", String(r.id));
});

// After every room switch — re-join any room that useSocket left
useEffect(() => {
  if (!isAdmin) return;
  adminRoomIdsRef.current.forEach((id) => socket.emit("conversation:join", id));
}, [isAdmin, activeRoomId]);

// After socket reconnect — re-join all rooms
useEffect(() => {
  if (!isAdmin) return;
  const rejoinAll = () =>
    adminRoomIdsRef.current.forEach((id) =>
      socket.emit("conversation:join", id),
    );
  socket.on("connect", rejoinAll);
  return () => {
    socket.off("connect", rejoinAll);
    adminRoomIdsRef.current.forEach((id) =>
      socket.emit("conversation:leave", id),
    );
    adminRoomIdsRef.current.clear();
  };
}, [isAdmin]);
```

### Optimistic send with rollback

```
User types → handleSend()
  ├─ Add temp message (id: "temp-{timestamp}") immediately to UI
  ├─ Clear input
  ├─ POST /messages
  │    ├─ Success → replace temp with real message from server
  │    │            keep optimistic time if server omits createdAt
  │    └─ Error   → remove temp message, restore input text, toast error
  └─ Update sidebar lastMessage
```

### Scroll behaviour

| Trigger                          | Behaviour                                |
| -------------------------------- | ---------------------------------------- |
| Room opens / messages first load | Instant jump to bottom (`justLoadedRef`) |
| New message received             | Smooth scroll to bottom                  |

### Real-time polling fallback

Because socket `message:new` broadcast depends on backend configuration, polling runs as a reliable fallback:

| Poll          | Interval         | What                                                  |
| ------------- | ---------------- | ----------------------------------------------------- |
| Messages      | 4 s              | Re-fetches active room messages, appends new ones     |
| Rooms sidebar | 8 s (admin only) | Re-fetches all rooms, updates lastMessage + hasUnread |

The poll **never shrinks** the message list and **never replaces** while an optimistic (temp) message is pending confirmation.

### Unread indicator

Conversation rows with `hasUnread: true` show:

- Bold, darker last-message preview text (`font-semibold text-gray-800`)
- Orange dot `●` in the bottom-right of the row

---

## Admin Layout — Scroll Fix

The `ChatPanel` must fill the remaining height without overflowing to the page scroll. This requires the full height chain to propagate correctly.

### How it works

`src/components/layout/admin/Layout.jsx` content wrapper:

```jsx
<div className="flex-1 min-h-0 overflow-y-auto" data-lenis-prevent>
  <div className="w-full min-h-full px-6 py-5 sm:px-8 sm:py-6 lg:px-10 lg:py-8 flex flex-col">
    <Outlet />
  </div>
</div>
```

- Outer div: `flex-1 min-h-0 overflow-y-auto` — fixed height, scrolls when content overflows
- Inner div: `min-h-full flex flex-col` — at least as tall as the scroll container; direct children are flex items

### Messages page usage

```jsx
// src/pages/admin/Messages.jsx
<div className="flex-1 min-h-0 flex flex-col">
  <ChatPanel role="admin" className="flex-1 min-h-0" />
</div>
```

Height chain: `h-dvh → main → outer div (flex-1 min-h-0) → inner div (min-h-full) → Messages page (flex-1 min-h-0) → ChatPanel (flex-1 min-h-0) → messages area (flex-1 overflow-y-auto) ✓`

---

## Page Usage

```jsx
// src/pages/admin/Messages.jsx
<ChatPanel role="admin" className="flex-1 min-h-0" />

// src/pages/Chat.jsx (public user chat)
<ChatPanel role="user" />
```

---

## Backend Requirements

Confirm these with the backend developer before integrating:

1. **Socket auth** — server reads token from `socket.handshake.auth.token`
2. **Room join** — server calls `socket.join(conversationId)` on `conversation:join` event
3. **Broadcast on send** — in the POST `/messages` handler, server must emit:
   ```js
   io.to(conversationId).emit("message:new", {
     conversationId,
     message: {
       id,
       content,
       createdAt,
       sender: { id, name, profileImage },
       isRead,
     },
   });
   ```
4. **Room name format** — client emits the raw UUID. Server must use the same string for `socket.join()`. If the server prefixes (e.g. `room_abc`), the client join will silently fail.

---

## Common Bugs & Fixes

| Bug                                        | Cause                                            | Fix                                                                            |
| ------------------------------------------ | ------------------------------------------------ | ------------------------------------------------------------------------------ |
| Sent message shows as received             | `id` comparison: number vs string                | `String(a) === String(b)` everywhere                                           |
| Duplicate messages on sender side          | Own socket event not skipped                     | Skip if `String(senderId) === String(currentUser.id)` — only when both defined |
| Timestamp disappears after send            | API response missing `createdAt`                 | `if (!real.time) real.time = optimistic.time`                                  |
| Sidebar last message stale                 | GET /rooms snapshot doesn't update               | After GET /messages, sync sidebar from last item in list                       |
| Socket re-registers listeners every render | Callbacks in `useEffect` deps                    | Use refs for callbacks; `deps = [conversationId]` only                         |
| Room join missed on first connect          | `socket.connect()` before handler                | Always register `socket.on("connect", ...)` before `socket.connect()`          |
| Admin misses messages from other rooms     | `useSocket` only joins active room               | `adminRoomIdsRef` — join all rooms on load and after every switch              |
| Crash on undefined payload fields          | `message.sender?.id` when `message` is undefined | `payload?.message ?? payload?.data`; null-guard every field                    |
| Messages scroll animates top → bottom      | `scrollIntoView("smooth")` on load               | `justLoadedRef`: instant on load, smooth for new messages                      |
| Real-time not working                      | Backend not broadcasting to socket room          | Add 4 s polling fallback; confirm backend emits `message:new`                  |
| Messages panel doesn't scroll (h-screen)   | Height chain broken in admin layout              | Inner wrapper needs `min-h-full flex flex-col`; page uses `flex-1 min-h-0`     |

---

## React.StrictMode Note

`<React.StrictMode>` (active in `src/index.jsx`) runs every effect **twice** in development only:
mount → cleanup → remount. This can cause the socket to connect, disconnect, and reconnect — and `adminRoomIdsRef` to be cleared before it is repopulated. This does **not** happen in production.
