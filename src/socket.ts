import ws from "ws";
import express from "express";
import { WebSocketServer } from "ws";
import { URLSearchParams } from "url";
import WebSocket from "ws";
import userInterface from "./types";
import website from "./schema/website.js";

export const app = express();
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const wss = new WebSocketServer({ server });
const map = new Map(); // senderId to ws
const map1 = new Map(); // senderId to ip , to find live users

wss.on("connection", async (ws, req) => {
  const urlParams = new URLSearchParams(req.url?.split("?")[1]);
  const senderId = urlParams.get("senderId");
  // console.log(`sender Id:`, senderId);
  // console.log(req.socket.remoteAddress);
  let ip = req.socket.remoteAddress;
  ip = !ip ? "olo" : ip;
  map.set(senderId, ws);
  map1.set(senderId, ip);
  await website.findOneAndUpdate(
    { url: senderId },
    { $inc: { live_users: 1 } }
  );
  const web = await website.findOne({ url: senderId });
  let totalUsersMap = new Map(Object.entries(web?.total_users));
  const count: any = totalUsersMap?.get(ip);
  await website.findOneAndUpdate(
    { url: senderId },
    { $set: { [`total_users.${ip}`]: 1 + count } }
  );
  console.log(await website.find({ url: senderId }));
  console.log(totalUsersMap.get(ip));

  ws.on("message", async (data, isBinary) => {
    const messageString = data.toString();
    const parsedMessage = JSON.parse(messageString);
    const { owner, url, type, payload } = parsedMessage;
    const analytics = await website.find({ url: url });
    // const receiverSocket = map.get(receiverId);
    // console.log(receiverSocket + " " + receiverId);
    // if (!room) {
    //   if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
    //     receiverSocket.send(JSON.stringify(message), { binary: isBinary });
    //   }
    // } else {
    //     const users=await room.find({_id:room});
    //     users.forEach((user:userInterface)=>{
    //         const receiverSocket = map.get(user._id);
    //         if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
    //             receiverSocket.send(JSON.stringify(message), { binary: isBinary });
    //         }
    //     })
    // }
    // console.log(`Received message => ${parsedMessage}`);
  });
  ws.send("Hello! paaji kya haal ne");
  ws.on("close", async () => {
    console.log("Client has disconnected");
    const web = await website.findOne({ url: senderId });
    let totalUsersMap = new Map(Object.entries(web?.total_users));
    const count: any = totalUsersMap?.get(ip);
    await website.findOneAndUpdate(
      { url: senderId },
      { $inc: { live_users: -1 } }
    );
    await website.findOneAndUpdate(
      { url: senderId },
      { $set: { [`total_users.${ip}`]: count - 1 } }
    );
    console.log(await website.find({ url: senderId }));
    map.delete(senderId);
    map1.delete(senderId);
  });
});
