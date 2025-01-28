import { Router } from "express";
import {
  checkUsername,
  getDetails,
  login,
  registerUser,
} from "../controllers/auth.controller.js";
import responseMiddleware from "../middlewares/ResponseMiddleware.js";
import { verifyUserToken } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.get("/health", (req, res) => {
  res.send("User Auth Service is Healthy!");
});

router.route("/register").post(registerUser, responseMiddleware);
router.route("/login").post(login, responseMiddleware);
router.route("/check-usernames").post(checkUsername, responseMiddleware);
router
  .route("/user-details")
  .get(verifyUserToken, getDetails, responseMiddleware);

export default router;
