import { Router } from "express";
import {login, register,addFriend,sendFriendRequest,checkLogin,search,getUser, getNotifications, deleteNotification} from "../controller/user.js";
import { check } from "../middleware/auth.js";

const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/sendFriendRequest").post(check,sendFriendRequest);
router.route("/acceptFriendRequest").post(check,addFriend);
router.route("/checkLogin").get(checkLogin);
router.route("/search/:id").get(check,search);
router.route("/getUser/:id").get(getUser);
router.route("/getNotifications/:id").get(check,getNotifications);
router.route("/deleteNotification/").post(check,deleteNotification);

export default router;