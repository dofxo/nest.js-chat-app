# WebSocket Events Documentation

This document provides descriptions of the WebSocket events used in the application.

---

## 1. **Message Event**

**Event Name:** `message`

### Description:

This event is triggered when a user sends a message. The server broadcasts the message to all other connected clients, except for the sender.

### Expected Payload:

```json
{
  "room": "room1",
  "message": "Hello, World!"
}
```

- `room`: The name of the room where the message is being sent.
- `message`: The content of the message sent by the user.

### Server Response:

```json
{
  "message": "Hello, World!",
  "username": "UserName",
  "date": "2024-12-06T12:00:00Z"
}
```

- `username`: The name of the user sending the message (decoded from the JWT token).
- `date`: The timestamp of when the message was sent.

---

## 2. **Typing Status Event**

**Event Name:** `typing`

### Description:

This event is triggered when a user starts typing. The server broadcasts the typing status to all other connected clients, indicating the user who is typing.

### Expected Payload:

```json
"typing"
```

- The payload simply indicates that the user is typing. No need to include the token in the payload, as it will be automatically retrieved from the cookies set after sign-up.

### Server Response:

```json
{
  "username": "UserName"
}
```

- `username`: The name of the user who is typing (decoded from the JWT token).

---

## 3. **User Joined Event**

**Event Name:** `userJoined`

### Description:

This event is triggered when a user joins a room. The server broadcasts the new user to all other connected clients in the room.

### Server Response:

```json
{
  "username": "UserName"
}
```

- `username`: The name of the user who has joined the room.

---

## 4. **User Left Event**

**Event Name:** `userLeft`

### Description:

This event is triggered when a user leaves a room. The server broadcasts the user leaving to all other connected clients in the room.

### Server Response:

```json
{
  "name": "UserName"
}
```

- `name`: The name of the user who has left the room.

---

## Example: Sending a Message

To send a message, connect to the WebSocket server and emit the `message` event with the following data:

```js
const socket = io("http://localhost:3000", {
  withCredentials: true, // Allow cookies to be sent with the connection
});
socket.emit("message", { room: "room1", message: "Hello, World!" }); // Only message and room name are needed
```

**Server Response**:
The server will broadcast the message to all other clients in the room, which will receive:

```json
{
  "message": "Hello, World!",
  "username": "UserName",
  "date": "2024-12-06T12:00:00Z"
}
```

---

## Example: Typing Event

To indicate that you're typing, connect to the WebSocket server and emit the `typing` event:

```js
const socket = io("http://localhost:3000", {
  withCredentials: true, // Allow cookies to be sent with the connection
});
socket.emit("typing");
```

**Server Response**:
The server will broadcast the typing status to all other clients, which will receive:

```json
{
  "username": "UserName"
}
```

---

## Example: Joining a Room

To join a room, connect to the WebSocket server and emit the `joinRoom` event:

```js
const socket = io("http://localhost:3000", {
  withCredentials: true, // Allow cookies to be sent with the connection
});
socket.emit("joinRoom", "room1");
```

**Server Response**:
The server will broadcast the new user joining to all other clients in the room:

```json
{
  "username": "UserName"
}
```

---

## Example: Leaving a Room

To leave a room, connect to the WebSocket server and emit the `leaveRoom` event:

```js
const socket = io("http://localhost:3000", {
  withCredentials: true, // Allow cookies to be sent with the connection
});
socket.emit("leaveRoom", "room1");
```

**Server Response**:
The server will broadcast the user leaving to all other clients in the room:

```json
{
  "name": "UserName"
}
```
