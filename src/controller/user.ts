import { Request, Response } from "express";
import User from "../schema/user.js";
import prisma from "../prisma/prisma.js";
import bcrypt from "bcrypt";
import userInterface from "../types.js";
import { log } from "console";
import createToken from "../utils/jwt.js";
import user from "../schema/user.js";
import notifications from "../schema/notifications.js";
import jwt from "jsonwebtoken";
import website from "../schema/website.js";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log(req.body);  
  const data: userInterface[] = await user.find({ username: username });
  const user1 = data[0];
  const secret: any = process.env.secret;
  console.log(req.body);
  if (!user1) {
    res.send(JSON.stringify("Password is incorrect"));
    return;
  } else {
    if (!(await bcrypt.compare(password, user1.password))) {
      console.log("wrong");
      res.send(JSON.stringify("Password is incorrect"));
      return;
    }
  }
  res
    .cookie("token", createToken({ ...user1, password: "" }), {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60),
    })
    .send(user1);
};
export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token").send("Logged out");
}

export const register = async (req: Request, res: Response) => {
  const { email, password, username, firstName, lastName }: userInterface =
    req.body;
  const check = await user.find({
    $or: [{ email: email }, { username: username }],
  });
  console.log(username,check);
  if (check.length != 0) {
    console.log("check= ", check);
    console.log("User already exists");
    res.send(JSON.stringify("User already exists"));
    return;
  }else{
  const password_hashed = await bcrypt.hash(password, 10);
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
  res.status(200).send(JSON.stringify("User created successfully"));
}
};

export const getSites=async(req:Request,res:Response)=>{
  const owner=req.body.owner;
  const sites=await website.find({owner:owner});
  //console.log(await website.find());
  // console.log("owner= ",owner);
  // console.log("sites= ",sites);
  res.send(JSON.stringify(sites));
}

export const sendFriendRequest = async (req: Request, res: Response) => {
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
};

export const addFriend = async (req: Request, res: Response) => {
  const { id, friendId, notification_id } = req.body;
  const check = await user.find({ _id: id, friends: friendId });
  await notifications.findByIdAndDelete(notification_id);
  if (check.length != 0) {
    console.log("Already friends");
    res.send(JSON.stringify("Already friends"));
    return;
  }
  const user1 = await user.findOneAndUpdate(
    { _id: id },
    { $push: { friends: friendId } }
  );
  const user2 = await user.findOneAndUpdate(
    { _id: friendId },
    { $push: { friends: id } }
  );
  res.send("Friend added");
};

export const getFriends = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await user.findById(id);
  const friends = await user.find({ _id: { $in: data!.friends } });
  res.send(JSON.stringify(friends));
};

export const deleteNotification = async (req: Request, res: Response) => {
  const { id } = req.body;
  console.log(id);
  await notifications.findByIdAndDelete(id);
  res.send("Notification deleted");
};

export const checkLogin = async (req: Request, res: Response) => {
  const token =
    req.cookies.token ||
    (req.headers["authorization"]
      ? JSON.parse(req.headers["authorization"])["value"]
      : null);
  const secret: any = process.env.secret;
  try {
    if (!token) {
      return res.send({ message: "No token" });
    } else {
      const data: any = jwt.verify(token, secret);
      return res.status(200).send(data["_doc"]);
    }
  } catch (err) {
    return res.status(401).send({ message: "invalid token" });
  }
};

export const search = async (req: Request, res: Response) => {
  const query = req.params.id;
  const users = await user.find({
    $or: [
      { username: { $regex: query, $options: "i" } },
      { firstName: { $regex: query, $options: "i" } },
      { lastName: { $regex: query, $options: "i" } },
    ],
  });
  res.send(JSON.stringify(users));
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  const data = await user.findById(id);
  res.send(JSON.stringify(data));
};

export const getNotifications = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await notifications.find({ reciever_id: id });
  console.log(data);
  res.send(JSON.stringify(data));
};
