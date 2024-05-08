"use strict";
const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true,
};
const app = express();
app.use(cors(corsOptions));
const server = createServer(app);
const io = new Server(server, {
    cors: corsOptions,
});
app.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>");
});
io.on("connection", (socket) => {
    console.log(`a user connected at ${socket.id}\n`);
    socket.on("send-message", (message) => {
        socket.broadcast.emit("receive-message", message);
    });
});
server.listen(3000, "127.0.0.1", () => {
    console.log("server running at http://127.0.0.1:3000");
});
