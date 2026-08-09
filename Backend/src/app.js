import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import loginRouter from "./routes/auth.route.js";
import assignmentRouter from "./routes/assignment.route.js";
import submissionRouter from "./routes/submission.route.js";
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRouter);
app.use("/api/auth", loginRouter);
app.use("/api/assignment", assignmentRouter);
app.use("/api/submissions", submissionRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not Found",
  });
});

export default app;
