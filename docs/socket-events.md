WebSocket Events Documentation

This document provides descriptions of the WebSocket events used in the application.

1. Message Event

Event Name: message
Description:

This event is triggered when a user sends a message. The server broadcasts the message to all other connected clients, except for the sender.
Expected Payload:

{
"message": "Hello, World!",
"token": "jwt_token_here"
}

    message: The content of the message sent by the user.
    token: JWT token used for user authentication (optional, will be decoded to get the user's name). Note: The token must be sent via cookies, as the server checks for the token in the request headers.

Server Response:

The server will broadcast the following to all connected clients (except the sender):

{
"message": "Hello, World!",
"username": "UserName",
"date": "2024-12-06T12:00:00Z"
}

    username: Name of the user sending the message (decoded from JWT token).
    date: The timestamp of when the message was sent.

2. Typing Status Event

Event Name: typing
Description:

This event is triggered when a user starts typing. The server broadcasts the typing status to all other connected clients, indicating the user who is typing.
Expected Payload:

{
"token": "jwt_token_here"
}

    token: JWT token used for user authentication (optional, will be decoded to get the user's name). Note: The token must be sent via cookies, as the server checks for the token in the request headers.

Server Response:

The server will broadcast the following to all connected clients:

{
"username": "UserName"
}

    username: Name of the user who is typing (decoded from JWT token).

3. Connection Event

Event Name: connection
Description:

Triggered when a new user connects to the WebSocket server. The server authenticates the user using the JWT token (if available) and sets up event listeners for message and typing.
Expected Payload:

    JWT token in cookies (token).

Server Response:

No direct response is sent. The server will start listening for the message and typing events after successful connection. 4. Disconnection Event

Event Name: disconnect
Description:

Triggered when a user disconnects from the WebSocket server. The server cleans up the user's session.
Expected Payload:

    None

Server Response:

No response is sent. The user's session will be terminated on the server.
How to Use:

    WebSocket Connection: Connect to the WebSocket server using a WebSocket client (e.g., in your frontend app or using a tool like Postman).

    Credentials (Cookies): Ensure that you send the JWT token as part of your cookies. This allows the server to authenticate the user and identify the sender for events like message and typing.

Troubleshooting

    If the token is invalid or not provided, the server will treat the user as "Anonymous" for events that require user identification (e.g., message and typing).

    Make sure that cookies are enabled and credentials are allowed in your WebSocket client when connecting to the server. Without sending credentials via cookies, the server won't be able to decode the token.

Example: Sending a Message

To send a message, connect to the WebSocket server and emit the message event with the following data:

const socket = io("http://localhost:3000", {
withCredentials: true, // Allow cookies to be sent with the connection
});
socket.emit("message", {
message: "Hello, World!",
token: "jwt_token_here", // This token should be sent via cookies for authentication
});

Server Response: The server will broadcast the message to all other clients, which will receive:

{
"message": "Hello, World!",
"username": "UserName",
"date": "2024-12-06T12:00:00Z"
}

Example: Typing Event

To indicate that you're typing, connect to the WebSocket server and emit the typing event:

const socket = io("http://localhost:3000", {
withCredentials: true, // Allow cookies to be sent with the connection
});
socket.emit("typing", { token: "jwt_token_here" });

Server Response: The server will broadcast the typing status to all other clients, which will receive:

{
"username": "UserName"
}
