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
const map1 = new Map<String, String[]>(); // senderId to ip , to find live users

wss.on("connection", async (ws, req) => {
  const urlParams = new URLSearchParams(req.url?.split("?")[1]);
  const senderId = urlParams.get("senderId");
  console.log("connected= " + senderId);
  console.log(`ip address= `, req.headers["x-forwarded-for"]);
  const forwarded = req.headers["x-forwarded-for"];
  let ip1: string,ip2:string;

  if (Array.isArray(forwarded)) {
    ip1 = forwarded[1];
    ip2 = forwarded[0];
  } else if (typeof forwarded === "string" && forwarded !== undefined) {
    ip1 = forwarded.split(",")[1].trim();
    ip2 = forwarded.split(",")[0].trim();
  } else {
    ip1 = "ulala";
    ip2="ulala";
  }

  const ip: string = ip1.replace(/\./g, "_");
  const ip3 = ip2.replace(/\./g, "_");

  console.log("ip= ", ip);
  console.log("ip= ", typeof ip);
  if (senderId != null && senderId.length != 0 && senderId != undefined) {
    map.set(ip, ws);                   
    if (senderId != null && !map1.has(senderId))
      map1.set(senderId, new Array());
    if (
      senderId != null &&
      map1.get(senderId) != null &&
      !map1.get(senderId)?.includes(ip)
    )
      map1.get(senderId)?.push(ip);
    const web = await website.findOne({ url: senderId });
    let totalUsersMap,
      count: any = 0;
    if (web == null) {
      const website1 = new website({
        url: senderId,
        live_users: 1,
        total_users: { [ip3]: 1 },
      });
      website1.save();
    }
    if (web != null && web.total_users != null) {
      await website.findOneAndUpdate(
        { url: senderId },
        { $inc: { live_users: 1 } }
      );
      totalUsersMap = new Map(Object.entries(web.total_users));
      if (totalUsersMap.get(ip3) != Number.isNaN && totalUsersMap.has(ip3))
        count = totalUsersMap.get(ip3);
      await website.findOneAndUpdate(
        { url: senderId },
        { $set: { [`total_users.${ip3}`]: 1 + count } }
      );
    }
  }
  //console.log(await website.find({ url: senderId }));
  //console.log(totalUsersMap.get(ip));

  ws.on("message", async (data, isBinary) => {
    const messageString = data.toString();
    const parsedMessage = JSON.parse(messageString);
    const { owner, url, type, payload } = parsedMessage;
    console.log("message received= ", parsedMessage);
    if (owner != "default" && owner != null && owner != undefined)
      await website.findOneAndUpdate({ url: url }, { owner: owner });
    send(url, senderId);
  });
  ws.send(JSON.stringify({ message: "Hello! paaji kya haal ne" }));
  ws.on("close", async () => {
    console.log("Client has disconnected");
    if (senderId != null && senderId != undefined && senderId.length != 0) {
      const web = await website.findOne({ url: senderId });
      if (web != null && web.total_users != null) {
        let totalUsersMap = new Map(Object.entries(web?.total_users));
        const count: any = totalUsersMap?.get(ip3);
        await website.findOneAndUpdate(
          { url: senderId },
          { $inc: { live_users: -1 } }
        );
        await website.findOneAndUpdate(
          { url: senderId },
          { $set: { [`total_users.${ip3}`]: count - 1 } }
        );
      }
      send(senderId, senderId);
      if (!(map.get(ip) && map.get(ip).readyState === WebSocket.OPEN))
        map.delete(ip);
      const users = map1.get(senderId);
      if (users != null)
        map1.set(
          senderId,
          users.filter((ipv) => {
            return ipv != ip;
          })
        );
    }
  });
});

async function send(url: string, senderId: string | null) {
  let message = await website.findOne({ url: url });
  const users = map1.get(url);
  console.log("users= ", users);
  users?.forEach((ipv) => {
    const receiverSocket = map.get(ipv);
    console.log(
      "receiverSocket= ",
      receiverSocket && receiverSocket.readyState === WebSocket.OPEN
    );
    if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
      if (senderId != null) {
        console.log(
          "sending message =",
          JSON.stringify({
            live_users: message?.live_users,
            total_users: message?.total_users,
            new_signups: 0,
          })
        );
        receiverSocket.send(
          JSON.stringify({
            live_users: message?.live_users,
            total_users: message?.total_users,
            new_signups: 0,
          })
        );
      }
    }
  });
}
