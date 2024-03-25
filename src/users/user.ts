import bodyParser from "body-parser";
import express from "express";
import { BASE_USER_PORT } from "../config";

export type SendMessageBody = {
  message: string;
  destinationUserId: number;
};

export async function user(userId: number) {
  const _user = express();
  _user.use(express.json());
  _user.use(bodyParser.json());

  let lastReceivedMessage: string | null = null;

  // GET /status
  _user.get("/status", (req, res) => {
    res.send("live");
  });

  // GET /getLastReceivedMessage
  _user.get("/getLastReceivedMessage", (req, res) => {
    res.json({ result: lastReceivedMessage });
  });

  // GET /getLastSentMessage
  _user.get("/getLastSentMessage", (req, res) => {
    res.json({ result: null });
  });

  // POST /message
  _user.post("/message", (req, res) => {
    const { message, destinationUserId }: SendMessageBody = req.body;
    lastReceivedMessage = message;
    res.send("success");
  });

  const server = _user.listen(BASE_USER_PORT + userId, () => {
    console.log(
      `User ${userId} is listening on port ${BASE_USER_PORT + userId}`
    );
  });

  return server;
}
