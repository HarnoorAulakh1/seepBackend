var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import room from "../schema/room";
import messages from "../schema/message";
export const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, users } = req.body;
    const room1 = new room({
        name,
        users,
    });
    room1.save();
    res.send("Room created");
});
export const getRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield room.find({});
    res.send(rooms);
});
export const addUsersToRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { users, id } = req.body;
    yield room.findByIdAndUpdate(id, { $push: { users: { $each: users } } });
    res.send("Users added to room");
});
export const deleteRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield room.findByIdAndDelete(id);
    yield messages.deleteMany({ room: id });
    res.send("Room deleted");
});
