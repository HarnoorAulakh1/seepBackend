import { Router } from "express";
import {
  login,
  getFriends,
  register,
  addFriend,
  sendFriendRequest,
  checkLogin,
  search,
  getUser,
  getNotifications,
  deleteNotification,
  getSites,
  logout,
} from "../controller/user.js";
import { check } from "../middleware/auth.js";

const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").post(logout);
router.route("/getSites").post(getSites);
router.route("/sendFriendRequest").post(check, sendFriendRequest);
router.route("/acceptFriendRequest").post(check, addFriend);
router.route("/checkLogin").get(checkLogin);
router.route("/search/:id").get(check, search);
router.route("/getUser/:id").get(getUser);
router.route("/getNotifications/:id").get(check, getNotifications);
router.route("/deleteNotification/").post(check, deleteNotification);
router.route("/getFriends/:id").get(getFriends);

export default router;
