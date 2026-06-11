import express from "express";
import {
  getActivePolls,
  createNewPoll,
  updatePoll,
  getRecentPolls,
  getMyPolls,
  removePoll,
} from "../controllers/pollController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/active", authMiddleware, getActivePolls);
router.get("/recent", authMiddleware, getRecentPolls);
router.post("/create", authMiddleware, createNewPoll);
router.post("/update", authMiddleware, updatePoll);
router.get("/my-polls/:authID", authMiddleware, getMyPolls);
router.delete("/remove/:pollID", authMiddleware, removePoll);

export default router;
