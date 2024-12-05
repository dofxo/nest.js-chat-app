# WebSocket Events Documentation

This document provides descriptions of the WebSocket events used in the application.

---

## 1. **Message Event**

**Event Name:** `message`

### Description:

This event is triggered when a user sends a message. The server broadcasts the message to all other connected clients, except for the sender.

### Expected Payload:

```json
"Hello, World!"
```

- `message`: The content of the message sent by the user. Only the message string is needed—no need to include any additional data like the token.

### Server Response:

```json
{
  "message": "Hello, World!",
  "username": "UserName",
  "date": "2024-12-06T12:00:00Z"
}
```

- `username`: Name of the user sending the message (decoded from JWT token).
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

- `username`: Name of the user who is typing (decoded from JWT token).

---

## Example: Sending a Message

To send a message, connect to the WebSocket server and emit the `message` event with the following data:

```js
const socket = io("http://localhost:3000", {
  withCredentials: true, // Allow cookies to be sent with the connection
});
socket.emit("message", "Hello, World!"); // Only message string is needed
```

**Server Response**:
The server will broadcast the message to all other clients, which will receive:

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
