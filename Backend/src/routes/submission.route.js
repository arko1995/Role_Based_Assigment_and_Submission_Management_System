import express from "express";
import {
  createSubmission,
  getAssignmentSubmissions,
  getMySubmissions,
  updateSubmission,
} from "../controller/submission.controller.js";
import { protectRoute, allowRoles } from "../middleware/auth.middleware.js";
const router = express.Router();
router.use(protectRoute);

router.route("/").get(allowRoles("student"), getMySubmissions);

router
  .route("/:assignmentId")
  .post(allowRoles("student"), createSubmission)
  .get(allowRoles("teacher", "admin"), getAssignmentSubmissions);

router.route("/:submissionId").patch(allowRoles("student"), updateSubmission);

export default router;
