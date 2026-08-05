import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "No user found",
      });
      return;
    }

    const comparePassword = bcrypt.compare(password, 10);

    if (comparePassword !== user.password) {
      res.status(401).json({
        success: false,
        message: "authorization failed",
      });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role });

    res.status(200).json({
      success: true,
      message: "login successful",
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      message: "Internal server error",
      error: error,
    });
  }
};
