import ws from "ws";
import express from "express";
import { WebSocketServer } from "ws";
import { URLSearchParams } from "url";
import WebSocket from "ws";
import userInterface from "./types";

export const app = express();
const port=process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const wss = new WebSocketServer({ server });
const map = new Map();

wss.on("connection", async (ws, req) => {
  const urlParams = new URLSearchParams(req.url?.split("?")[1]);
  const senderId = urlParams.get("senderId");
  console.log(`sender Id:`, senderId);
  map.set(senderId, ws);
  console.log(map.size);
  ws.on("message", async (data, isBinary) => {
    const messageString = data.toString();
    const parsedMessage = JSON.parse(messageString);
    const { senderId, receiverId, message,type } = parsedMessage;
    const receiverSocket = map.get(receiverId);
      if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN){ 
        console.log("sending message");
        receiverSocket.send(JSON.stringify({message,type}), { binary: isBinary });
      }
    console.log(`Received message => ${parsedMessage}`);
  });
  ws.send(JSON.stringify({message:"hello from server"}));
  wss.on("close", () => {
    console.log("Client has disconnected");
  });
});