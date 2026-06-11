import mongoose, { Document, Schema } from "mongoose";

export interface Ipoll extends Document {
  question: string;
  options: string[];
  votes: Map<string, number>;
  createdBy: mongoose.Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const pollSchema = new Schema<Ipoll>(
  {
    question: { type: String, required: true, trim: true },
    options: { type: [String], required: true },
    votes: { type: Map, of: Number, default: {} },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<Ipoll>("Poll", pollSchema);
