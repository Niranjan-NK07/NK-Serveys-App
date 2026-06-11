import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: [true, "Name is required!"] },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: 8,
    },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (_next) {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || "your_jwt_secret_key",
    {
      expiresIn: "1h",
    },
  );
  return token;
};

const User = mongoose.model("User", userSchema);
export default User;
