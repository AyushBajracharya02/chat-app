const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");

let users: Map<number, string> = new Map<number, string>();
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

app.get("/", (req: any, res: any) => {
	res.send("<h1>Hello everyone</h1>");
});

io.on("connection", (socket: any) => {
	io.sockets.emit("update-count", io.engine.clientsCount);
	socket.emit("send-username", decideUserName(users, io.engine.clientsCount));
	socket.on("send-message", (message: any) => {
		socket.broadcast.emit("receive-message", message);
	});
	socket.on("disconnect", (reason: any) => {
		io.sockets.emit("update-count", io.engine.clientsCount);
	});
});

server.listen(3000, "127.0.0.1", () => {
	console.log("server running at http://127.0.0.1:3000");
});

function decideUserName(users: Map<number, string>, count: number): string {
	if (!users.get(count)) {
		users.set(count, `Anonymous User ${count}`);
		const username = users.get(count);
		if (username) {
			return username;
		} else {
			throw new Error("Could not get username");
		}
	}
	return "";
}
