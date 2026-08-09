import express from "express";
import {
  createSubmission,
  getAllSubmissions,
  getAssignmentSubmissions,
  getMySubmissions,
  gradeSubmissions,
  updateSubmission,
} from "../controller/submission.controller.js";
import { protectRoute, allowRoles } from "../middleware/auth.middleware.js";
const router = express.Router();
router.use(protectRoute);

//student
router.get("/my", allowRoles("student"), getMySubmissions);
router.post(
  "/assignment/:assignmentId",
  allowRoles("student"),
  createSubmission,
);
router.patch("/:submissionId", allowRoles("student"), updateSubmission);

//teacher/admin
router.get(
  "/assignment/:assignmentId",
  allowRoles("admin", "teacher"),
  getAssignmentSubmissions,
);

//teacher
router.patch("/:submissionId/grade", allowRoles("teacher"), gradeSubmissions);

//admin
router.get("/", allowRoles("admin"), getAllSubmissions);

export default router;
