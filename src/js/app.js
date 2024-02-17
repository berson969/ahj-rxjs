const MESSAGES_BASE_URL = "http://localhost:7071";
const listGroup = document.querySelector(".list-group");

const getFormattedDate = (received) => {
  const date = new Date(received);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const dateLoc = date.toLocaleDateString("ru-Ru", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return `<span class="time d-inline">${hours}:${minutes}</span> <span class="date d-inline">${dateLoc}</span>`;
};

const cutSubject = (subject) => {
  if (typeof subject === "string" && subject.length > 15) {
    return `${subject.slice(0, 14)}...`;
  }
  return subject;
};

function renderItem(message) {
  const itemEl = document.createElement("li");
  itemEl.id = message.id;
  itemEl.classList.add("list-group-item", "light-gray-bg", "row", "d-flex");
  itemEl.innerHTML = `
<!--        <div class="row">-->
            <div class="col-md-9">
              <div class="d-flex flex-column">
                  <div class="row">
                      <span class="from col">${message.from}</span>
                      <span class="subject col">${cutSubject(
                        message.subject
                      )}</span>
                  </div>
      
                  <span class="body d-none mt-4">${message.body}</span>
              </div>
            </div>
            <div class="datetime d-flex col-md-3">
                  ${getFormattedDate(message.received)}
<!--            </div>-->
        </div>`;
  return itemEl;
}

const clickHandler = (event) => {
  const itemEl = event.target.closest(".list-group-item");
  if (itemEl) {
    const bodyDiv = itemEl.querySelector(".body");

    itemEl.classList.remove("light-gray-bg");

    if (bodyDiv.classList.contains("d-none")) {
      bodyDiv.classList.remove("d-none");
    } else {
      bodyDiv.classList.add("d-none");
    }
  }
};

let allMessages = [];

const renderMessages = async () => {
  const url = new URL(MESSAGES_BASE_URL + "/messages/unread");

  try {
    const response = await fetch(url);

    const responseJson = await response.json();
    const messages = responseJson.messages;

    const unreadMessages = messages.filter(
      (message) =>
        !allMessages.some((readMessage) => readMessage.id === message.id)
    );
    allMessages = messages;

    if (unreadMessages) {
      unreadMessages.forEach((message) => {
        listGroup.insertBefore(renderItem(message), listGroup.firstChild);
      });
    }
    while (listGroup.querySelectorAll(".list-group-item").length > 20) {
      const itemEL = listGroup.lastElementChild;
      if (itemEL) {
        itemEL.remove();
      }
    }
    listGroup.addEventListener("click", clickHandler);
  } catch (error) {
    console.error("Error fetching or processing messages:", error);
  }
};

function clearGroup() {
  listGroup.innerHTML = "";
}

const startServer = async () => {
  try {
    const response = await fetch(`${MESSAGES_BASE_URL}/messages/start`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to start server");
    }

    const result = await response.json();
    console.log("Server started successfully:", result);
  } catch (error) {
    console.error("Error start server:", error);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  clearGroup();
  await renderMessages();
  setInterval(async () => {
    await renderMessages();
  }, 10000);
});

const startBtn = document.querySelector('[data-method="startServer"]');

startBtn.addEventListener("click", async () => {
  await startServer();
});
