import express from "express";
import userRouter from "./routes/user.route.js";
import loginRouter from "./routes/auth.route.js";
const app = express();

app.use(express.json());

app.use("/api", userRouter);
app.use("/api/auth", loginRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not Found",
  });
});

export default app;
