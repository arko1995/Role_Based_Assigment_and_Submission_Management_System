import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import User from "../model/user.model";
dotenv.config();

const protectRoute = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      res.status(401).json({
        success: true,
        message: "Unauthorized access",
      });
      return;
    }

    const decode = jwt.verify(accessToken, 10);

    const user = await User.findById(decode.id);

    if (!user) {
      res.status(404).json({
        success: true,
        message: "No user found",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: true,
      message: "Internal server error",
      error: error,
    });
  }
};

const adminRoute = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: "Authorization denied - Admin only",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export { protectRoute, adminRoute };
