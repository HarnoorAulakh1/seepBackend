var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { WebSocketServer } from "ws";
import { URLSearchParams } from "url";
import website from "./schema/website";
export const app = express();
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
const wss = new WebSocketServer({ server });
const map = new Map();
wss.on("connection", (ws, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const urlParams = new URLSearchParams((_a = req.url) === null || _a === void 0 ? void 0 : _a.split("?")[1]);
    const senderId = urlParams.get("senderId");
    console.log(`sender Id:`, senderId);
    map.set(senderId, ws);
    console.log(map.size);
    ws.on("message", (data, isBinary) => __awaiter(void 0, void 0, void 0, function* () {
        const messageString = data.toString();
        const parsedMessage = JSON.parse(messageString);
        const { owner, url, type, payload } = parsedMessage;
        const analytics = yield website.find();
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
        console.log(`Received message => ${parsedMessage}`);
    }));
    ws.send("Hello! Message From Server!!");
    wss.on("close", () => {
        console.log("Client has disconnected");
    });
}));
