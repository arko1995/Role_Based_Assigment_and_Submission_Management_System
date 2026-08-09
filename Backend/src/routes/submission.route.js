import express from "express";
import { createSubmission } from "../controller/submission.controller.js";
const router = express.Router();

router.route("/:assignmentId").post(createSubmission);

export default router;
