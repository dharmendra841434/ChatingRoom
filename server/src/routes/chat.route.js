import { Router } from "express";
import { verifyUserToken } from "../middlewares/AuthMiddleware.js";
import {
  getChatDataByUserId,
  getSingleUserChat,
  markAllMessagesAsRead,
} from "../controllers/chat.controller.js";

const router = Router();

router.get("/health", (req, res) => {
  res.send("User Chat Service is Healthy!");
});
router.route("/friends-chat").get(verifyUserToken, getChatDataByUserId);
router.route("/single-chat/:chatKey").get(verifyUserToken, getSingleUserChat);
router.route("/mark-as-read").put(verifyUserToken, markAllMessagesAsRead);

export default router;
