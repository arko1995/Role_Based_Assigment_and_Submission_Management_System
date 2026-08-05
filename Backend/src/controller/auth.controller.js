import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "please provide required information",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "No user found",
      });
      return;
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      res.status(401).json({
        success: false,
        message: "authorization failed",
      });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("accessToken", token);

    res.status(200).json({
      success: true,
      message: "login successful",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export { login };
