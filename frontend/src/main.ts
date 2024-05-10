import { io } from "socket.io-client";
import "bootstrap/scss/bootstrap.scss";
import { Tooltip } from "bootstrap";
import "./scss/main.scss";
import "material-symbols";

const usernameInput = document.querySelector("#change-username") as HTMLInputElement;
const peopleCountElement = document.querySelector(".chat-app-count .number");
const socket = io("http://127.0.0.1:3000");

document.querySelector("#send-message-button")?.addEventListener("click", () => {
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
socket.on("update-count", (count) => {
	if (!peopleCountElement) {
		return;
	}
	peopleCountElement.textContent = count;
});
socket.on("send-username", (username) => {
	if (!usernameInput) {
		return;
	}
	usernameInput.value = username;
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

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList: Array<Tooltip> = [...tooltipTriggerList].map(
	(tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
);
