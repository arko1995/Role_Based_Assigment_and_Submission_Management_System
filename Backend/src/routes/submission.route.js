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

router
  .route("/")
  .get(allowRoles("student"), getMySubmissions)
  .get(allowRoles("admin"), getAllSubmissions);

router
  .route("/:assignmentId")
  .post(allowRoles("student"), createSubmission)
  .get(allowRoles("teacher", "admin"), getAssignmentSubmissions)
  .patch(allowRoles("teacher"), gradeSubmissions);

router.route("/:submissionId").patch(allowRoles("student"), updateSubmission);

export default router;
