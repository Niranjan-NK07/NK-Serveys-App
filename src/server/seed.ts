// seed.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import Poll from "./models/Poll";
import User from "./models/User"; // make sure you have a User model

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    // Get the first user in the DB
    const user = await User.findOne();
    if (!user) {
      throw new Error("No user found in DB. Please create a user first.");
    }

    // Clear existing polls
    await Poll.deleteMany({});
    console.log("Cleared existing polls");

    const now = new Date();

    const polls = [
      {
        question: "Best programming language?",
        options: ["JavaScript", "Python", "Java"],
        votes: new Map([
          ["JavaScript", 0],
          ["Python", 0],
          ["Java", 0],
        ]),
        createdBy: user._id,
        expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        question: "Favorite frontend framework?",
        options: ["React", "Vue", "Angular"],
        votes: new Map([
          ["React", 0],
          ["Vue", 0],
          ["Angular", 0],
        ]),
        createdBy: user._id,
        expiresAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        question: "Best database for web apps?",
        options: ["MongoDB", "PostgreSQL", "MySQL"],
        votes: new Map([
          ["MongoDB", 0],
          ["PostgreSQL", 0],
          ["MySQL", 0],
        ]),
        createdBy: user._id,
        expiresAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      },
    ];

    await Poll.insertMany(polls);
    console.log("Inserted test polls");

    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (err) {
    console.error("Seeding error:", err);
  }
}

seed();
