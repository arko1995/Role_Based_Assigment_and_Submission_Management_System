import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import router from "./routes/user.route.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api", router);

app.listen(PORT, async () => {
  try {
    connectDB();
    console.log("server started on port:", PORT);
  } catch (error) {
    console.log(error);
  }
});
