import { Router } from "express";
import responseMiddleware from "../middlewares/ResponseMiddleware.js";
import {
  createNewGroup,
  getAllGropsOfUser,
  joinGroup,
} from "../controllers/group.controller.js";
import { verifyUserToken } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.get("/health", (req, res) => {
  res.send("Groups Service is Healthy!");
});

router.route("/all/:owner").get(getAllGropsOfUser, responseMiddleware);
router
  .route("/create")
  .post(verifyUserToken, createNewGroup, responseMiddleware);
router.route("/join").post(verifyUserToken, joinGroup, responseMiddleware);

export default router;
