import ws from "ws";
import express from "express";
import { WebSocketServer } from "ws";
import { URLSearchParams } from "url";
import WebSocket from "ws";
import userInterface from "./types";

export const app = express();
const port=process.env.PORT || 4000;
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
    const { senderId, receiverId, message, room } = parsedMessage;
    const receiverSocket = map.get(receiverId);
    console.log(receiverSocket + " " + receiverId);
    if (!room) {
      if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
        receiverSocket.send(JSON.stringify(message), { binary: isBinary });
      }
    } else {
        const users=await room.find({_id:room});
        users.forEach((user:userInterface)=>{
            const receiverSocket = map.get(user._id);
            if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
                receiverSocket.send(JSON.stringify(message), { binary: isBinary });
            }
        })
    }
    console.log(`Received message => ${parsedMessage}`);
  });
  ws.send("Hello! Message From Server!!");
  wss.on("close", () => {
    console.log("Client has disconnected");
  });
});
