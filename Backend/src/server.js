import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./lib/db.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server started on ${PORT}`);
    });
  } catch (error) {
    console.error("failed to start server", error);
    process.exit(1);
  }
};

startServer();
