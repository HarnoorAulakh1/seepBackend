import { Request, Response } from "express";
import room from "../schema/room";
import messages from "../schema/message";

export const createRoom = async (req: Request, res: Response) => {
  const { name, users } = req.body;
  const room1 = new room({
    name,
    users,
  });
  room1.save();
  res.send("Room created");
};

export const getRooms = async (req: Request, res: Response) => {
  const rooms = await room.find({});
  res.send(rooms);
}

export const addUsersToRoom = async (req: Request, res: Response) => {
    const { users, id } = req.body;
    await room.findByIdAndUpdate(id,{$push:{users:{$each:users}}});
    res.send("Users added to room");
}

export const deleteRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  await room.findByIdAndDelete(id);
  await messages.deleteMany({ room: id });
  res.send("Room deleted");
}
