import Router from "express";
import { createRoom } from "../controller/rooms";
import { getRooms, addUsersToRoom, deleteRoom } from "../controller/rooms";
import { check } from "../middleware/auth";
const router = Router();
router.route("/createRoom").post(check, createRoom);
router.route("/getRooms").get(check, getRooms);
router.route("/addUsersToRoom").put(check, addUsersToRoom);
router.route("/deleteRoom/:id").delete(check, deleteRoom);
