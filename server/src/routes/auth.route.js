import { Router } from "express";
import {
  checkUsername,
  login,
  registerUser,
} from "../controllers/auth.controller.js";
import responseMiddleware from "../middlewares/ResponseMiddleware.js";

const router = Router();

router.get("/health", (req, res) => {
  res.send("User Auth Service is Healthy!");
});

router.route("/register").post(registerUser, responseMiddleware);
router.route("/login").post(login, responseMiddleware);
router.route("/check-username").post(checkUsername, responseMiddleware);

export default router;
