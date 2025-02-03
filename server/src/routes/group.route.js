import { Router } from "express";
import {
  createNewGroup,
  deleteGroup,
  getAllGroupsOfUser,
  joinGroup,
} from "../controllers/group.controller.js";
import { verifyUserToken } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.get("/health", (req, res) => {
  res.send("Groups Service is Healthy!");
});

router.route("/all").get(verifyUserToken, getAllGroupsOfUser);
router.route("/create").post(verifyUserToken, createNewGroup);
router.route("/join").post(verifyUserToken, joinGroup);
router.route("/delete-group").post(verifyUserToken, deleteGroup);

export default router;
