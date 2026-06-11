import mongoose from "mongoose";
import Poll from "../models/Poll";

export const getActivePolls = async (req: any, res: any) => {
  try {
    const now = new Date();
    const activePolls = await Poll.find({ expiresAt: { $gt: now } }).sort({
      createdAt: -1,
    });
    res.status(200).json(activePolls);
  } catch (err) {
    res.status(500).json({ message: "Server error!" });
  }
};

export const getRecentPolls = async (req: any, res: any) => {
  try {
    const now = new Date();
    const recentPolls = await Poll.find({ expiresAt: { $lt: now } }).sort({
      createdAt: -1,
    });

    res.status(200).json({ recentPolls });
  } catch (err) {
    res.status(500).json({ message: "Server error!" });
  }
};

export const createNewPoll = async (req: any, res: any) => {
  try {
    const { question, options, createdBy, expiresAt } = req.body;

    if (!question || !question.trim() || !options || options.length < 2) {
      return res.status(400).json({ message: "Question is required!" });
    }

    const poll = await Poll.create({
      question: question?.trim(),
      options,
      votes: options.reduce((acc: Record<string, number>, opt: string) => {
        acc[opt] = 0;
        return acc;
      }, {}),
      createdBy,
      expiresAt: new Date(expiresAt),
    });

    await poll.save();
    res.status(201).json(poll);
  } catch (err: any) {
    console.error("Poll creation error:", err);
    res.status(500).json({ message: "Server error!", error: err.message });
  }
};

export const updatePoll = async (req: any, res: any) => {
  try {
    const { pollID, option } = req.body;

    if (!mongoose.isValidObjectId(pollID)) {
      return res.status(400).json({ message: "Invalid taskId" });
    }

    if (!option) {
      return res.status(400).json({ message: "Option is required!" });
    }

    const poll = await Poll.findByIdAndUpdate(
      pollID,
      {
        $inc: { [`votes.${option}`]: 1 },
      },
      { returnDocument: "after" },
    );

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    res.status(200).json(poll);
  } catch (err: any) {
    res.status(500).json({ message: "Server error!", error: err.message });
  }
};

export const removePoll = async (req: any, res: any) => {
  try {
    const pollID = req.params.pollID;

    if (!mongoose.isValidObjectId(pollID)) {
      return res.status(400).json({ message: "Invalid pollId" });
    }

    const poll = await Poll.findByIdAndDelete(pollID);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    res.status(200).json({ message: "Poll deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "Server error!", error: err.message });
  }
};

export const getMyPolls = async (req: any, res: any) => {
  try {
    const authID = req.params.authID;

    if (!mongoose.isValidObjectId(authID)) {
      return res.status(400).json({ message: "Invalid authID!" });
    }

    const myPolls = await Poll.find({ createdBy: authID }).sort({
      createdAt: -1,
    });

    res.status(200).json(myPolls);
  } catch (err: any) {
    res.status(500).json({ message: "Server error!", error: err.message });
  }
};
