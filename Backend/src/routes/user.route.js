import express from "express";
import {
  createUser,
  getUser,
  updateUser,
} from "../controller/user.controller.js";
import { allowRoles, protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.use(protectRoute);
router.use(allowRoles("admin"));
router.route("/users").get(getUser).post(createUser);
router.patch("/users/:id", updateUser);

export default router;
