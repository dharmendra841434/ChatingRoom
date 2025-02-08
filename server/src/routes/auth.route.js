import { Router } from "express";
import {
  acceptFriendRequest,
  cancelRecievedRequest,
  cancelSendedRequest,
  checkUsername,
  getChatDataByUserId,
  getDetails,
  getUserByUsername,
  login,
  registerUser,
  searchPeople,
  sendFriendRequest,
} from "../controllers/auth.controller.js";
import { verifyUserToken } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.get("/health", (req, res) => {
  res.send("User Auth Service is Healthy!");
});

router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/check-usernames").post(checkUsername);
router.route("/search").get(verifyUserToken, searchPeople);
router.route("/findByUsername").get(verifyUserToken, getUserByUsername);
router.route("/user-details").get(verifyUserToken, getDetails);
router.route("/send-request").post(verifyUserToken, sendFriendRequest);
router.route("/accept-request").post(verifyUserToken, acceptFriendRequest);
router
  .route("/cancel-recieved-request")
  .post(verifyUserToken, cancelRecievedRequest);
router
  .route("/cancel-sended-request")
  .post(verifyUserToken, cancelSendedRequest);
router.route("/friends-chat").get(verifyUserToken, getChatDataByUserId);

export default router;
