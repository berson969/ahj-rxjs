import express from "express";
import cors from "cors";
import { faker } from "@faker-js/faker";

const app = express();

app.use(cors());

let messages = [];
let intervalId;
let timeoutId;

const setMessage = () => {
  const newMessage = {
    id: faker.string.uuid(),
    from: faker.internet.email(),
    subject: faker.lorem.words(),
    body: faker.lorem.paragraphs(2),
    received: faker.date.between({
      from: "2020-01-01T00:00:00.000Z",
      to: Date.now(),
    }),
  };

  messages.push(newMessage);
  console.log("Новое сообщение установлено:", newMessage);
};

app.get("/messages/unread", (req, res) => {
  res.json({
    status: "ok",
    timestamp: Date.now(),
    messages: messages,
  });
});

app.post("/messages/start", (req, res) => {
  clearInterval(intervalId);
  clearInterval(timeoutId);
  intervalId = setInterval(() => {
    setMessage();
  }, 5000);
  console.log("server start");

  timeoutId = setTimeout(() => {
    clearInterval(intervalId);
    console.log("server stopped");
  }, 50000);

  res.json({
    status: "start",
  });
});

app.listen( () => console.log(`The server is running`));
