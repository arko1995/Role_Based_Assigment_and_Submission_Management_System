import express from "express";
import {
  createSubmission,
  updateSubmission,
} from "../controller/submission.controller.js";
import { protectRoute, allowRoles } from "../middleware/auth.middleware.js";
const router = express.Router();
router.use(protectRoute);
router.route("/:assignmentId").post(allowRoles("student"), createSubmission);

router.route("/:submissionId").patch(allowRoles("student"), updateSubmission);

export default router;
