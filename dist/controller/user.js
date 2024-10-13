var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
import createToken from "../utils/jwt.js";
import user from "../schema/user.js";
import notifications from "../schema/notifications.js";
import jwt from "jsonwebtoken";
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const data = yield user.find({ username: username });
    const user1 = data[0];
    const secret = process.env.secret;
    console.log(req.body);
    if (!user1) {
        res.status(401).send("User does not exist");
        return;
    }
    else {
        if (!(yield bcrypt.compare(password, user1.password))) {
            console.log("wrong");
            res.status(401).send(JSON.stringify("Password is incorrect"));
            return;
        }
    }
    res
        .cookie("token", createToken(Object.assign(Object.assign({}, user1), { password: "" })), {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60),
    })
        .send(user1);
});
export const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username, firstName, lastName } = req.body;
    const check = yield user.find({
        $or: [{ email: email }, { username: username }],
    });
    if (check.length != 0) {
        console.log("check= ", check);
        res.status(400).send(JSON.stringify("User already exists"));
        return;
    }
    const password_hashed = yield bcrypt.hash(password, 10);
    const newUser = new user({
        email,
        password: password_hashed,
        username,
        firstName,
        lastName,
        friends: [],
        status: true,
    });
    newUser.save();
    res.status(200).send("User created");
});
export const sendFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sender_id, reciever_id, message } = req.body;
    const data = new notifications({
        sender_id,
        reciever_id,
        type: "friendRequest",
        message,
        read: false,
    });
    data.save();
    console.log(req.body);
    res.status(200).send(JSON.stringify({ message: "Request sent" }));
});
export const addFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, friendId, notification_id } = req.body;
    const check = yield user.find({ _id: id, friends: friendId });
    yield notifications.findByIdAndDelete(notification_id);
    if (check.length != 0) {
        console.log("Already friends");
        res.send(JSON.stringify("Already friends"));
        return;
    }
    const user1 = yield user.findOneAndUpdate({ _id: id }, { $push: { friends: friendId } });
    const user2 = yield user.findOneAndUpdate({ _id: friendId }, { $push: { friends: id } });
    res.send("Friend added");
});
export const getFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = yield user.findById(id);
    const friends = yield user.find({ _id: { $in: data.friends } });
    res.send(JSON.stringify(friends));
});
export const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    console.log(id);
    yield notifications.findByIdAndDelete(id);
    res.send("Notification deleted");
});
export const checkLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token ||
        (req.headers["authorization"]
            ? JSON.parse(req.headers["authorization"])["value"]
            : null);
    const secret = process.env.secret;
    try {
        if (!token) {
            return res.status(401).send({ message: "No token" });
        }
        else {
            const data = jwt.verify(token, secret);
            return res.status(200).send(data["_doc"]);
        }
    }
    catch (err) {
        return res.status(401).send(0);
    }
});
export const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.params.id;
    const users = yield user.find({
        $or: [
            { username: { $regex: query, $options: "i" } },
            { firstName: { $regex: query, $options: "i" } },
            { lastName: { $regex: query, $options: "i" } },
        ],
    });
    res.send(JSON.stringify(users));
});
export const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    const data = yield user.findById(id);
    res.send(JSON.stringify(data));
});
export const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = yield notifications.find({ reciever_id: id });
    console.log(data);
    res.send(JSON.stringify(data));
});
