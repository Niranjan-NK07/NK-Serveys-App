import jwt from "jsonwebtoken";
import User from "../models/User";

export const authMiddleware: any = async (req: any, res: any, next: any) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || "your_jwt_secret_key",
      );
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
