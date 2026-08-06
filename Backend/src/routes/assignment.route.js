import express from "express";
import { createAssignment } from "../controller/assignment.controller.js";
import { protectRoute, allowRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.route("/").post(allowRoles("teacher"), createAssignment);

export default router;
