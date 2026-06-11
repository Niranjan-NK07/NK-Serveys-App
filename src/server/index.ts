import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/authRoutes";
import pollRoutes from "./routes/pollRoutes";

const port = process.env.PORT || 5000;

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", router);
app.use("/api/polls", pollRoutes);

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));
