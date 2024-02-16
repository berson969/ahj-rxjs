import express from "express";
import cors from "cors";
import { faker } from "@faker-js/faker";

const app = express();

app.use(cors());

let messages = [];

const setMessage = () => {
  const newMessage = {
    id: faker.string.uuid(),
    from: faker.internet.email(),
    subject: faker.lorem.words(),
    body: faker.lorem.paragraphs(2),
    received: faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: Date.now() }), // текущий временной метке в секундах
  };
  if (messages.length > 1000) {
    messages = [];
  }
  messages.push(newMessage);
  // console.log("Новое сообщение установлено:", newMessage);
};

app.get("/messages/unread", (req, res) => {
  res.json({
    status: "ok",
    timestamp: Date.now(),
    messages: messages,
  });
});

setInterval(() => {
  setMessage();
}, 10000);

// eslint-disable-next-line no-undef
const port = process.env.PORT || 7071;
app.listen(port, () => console.log(`The server is running on port ${port}.`));
