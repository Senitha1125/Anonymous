async function sendMessage() {

    const message = document.getElementById("messageInput").value;

    const response = await fetch("/message", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            message: message
        })

    });

    const data = await response.text();

    alert(data);

    loadMessages();
}

async function loadMessages() {

    const response = await fetch("/messages");

    const messages = await response.json();

    const messagesDiv = document.getElementById("messages");

    messagesDiv.innerHTML = "";

    messages.forEach((msg) => {

        messagesDiv.innerHTML += `
            <div class="message">

                <p>${msg.message}</p>

                <button onclick="deleteMessage('${msg._id}')">
                    Delete
                </button>

            </div>
        `;
    });

}
async function deleteMessage(id) {

    await fetch(`/message/${id}`, {

        method: "DELETE"

    });

    loadMessages();
}