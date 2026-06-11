import User from "../models/User";

export const Register: any = async (req: any, res: any) => {
  try {
    const { username, email, password } = req?.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const user = await User.create({ username, email, password });

    const token = (user as any).generateAuthToken();

    res.status(201).json({
      token,
      username: user.username,
      email: user.email,
      authID: user._id,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error!", error: err });
  }
};

export const Login: any = async (req: any, res: any) => {
  try {
    const { username, password } = req?.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const matched = (user as any).comparePassword(password);
    if (!matched) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = (user as any).generateAuthToken();

    res.status(200).json({
      token,
      username: user.username,
      email: user.email,
      authID: user._id,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error!" });
  }
};
