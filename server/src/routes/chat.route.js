import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.send("User Chat Service is Healthy!");
});

export default router;
