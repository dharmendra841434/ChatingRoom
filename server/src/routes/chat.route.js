import { Router } from "express";
import { verifyUserToken } from "../middlewares/AuthMiddleware.js";
import {
  getChatDataByUserId,
  markAllMessagesAsRead,
} from "../controllers/chat.controller.js";

const router = Router();

router.get("/health", (req, res) => {
  res.send("User Chat Service is Healthy!");
});
router.route("/friends-chat").get(verifyUserToken, getChatDataByUserId);

router.route("/mark-as-read").put(verifyUserToken, markAllMessagesAsRead);

export default router;
