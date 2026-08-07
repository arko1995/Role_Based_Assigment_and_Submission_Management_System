import express from "express";
import {
  createAssignment,
  deleteAssignment,
  getAssignment,
  getAssignmentById,
  updateAssignment,
} from "../controller/assignment.controller.js";
import { protectRoute, allowRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);

router
  .route("/")
  .post(allowRoles("teacher"), createAssignment)
  .get(allowRoles("student", "teacher", "admin"), getAssignment);

router
  .route("/:id")
  .get(allowRoles("teacher", "student", "admin"), getAssignmentById)
  .patch(allowRoles("teacher", "admin"), updateAssignment)
  .delete(allowRoles("teacher", "admin"), deleteAssignment);

export default router;
