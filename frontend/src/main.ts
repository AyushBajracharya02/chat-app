import { io } from "socket.io-client";
import "bootstrap/scss/bootstrap.scss";
import "./scss/main.scss";

const socket = io("http://127.0.0.1:3000");

document.querySelector("#send-message-button")?.addEventListener("click", (e) => {
	const messageBox: HTMLTextAreaElement = document.querySelector(
		"#messageBox"
	) as HTMLTextAreaElement;
	if (!messageBox) {
		return;
	}
	const message: string = messageBox.value;
	messageBox.value = "";
	displayMessage(message, "sent");
	socket.emit("send-message", message);
});

socket.on("receive-message", (message) => {
	displayMessage(message, "received");
});

function displayMessage(message: string, messageType: "sent" | "received") {
	const formattedMessage = message.split("\n").join("<br/>");
	const messageBlock = `<div class="col-12">
			<div class="message-wrapper ${messageType}">
				<span class="message ${messageType}">${formattedMessage}</span>
			</div>
	</div>`;
	document.querySelector(".chat-app-messages")?.insertAdjacentHTML("beforeend", messageBlock);
}
