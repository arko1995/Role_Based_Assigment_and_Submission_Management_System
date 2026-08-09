import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from "../controller/user.controller.js";
import { allowRoles, protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.use(protectRoute);
router.use(allowRoles("admin"));
router.route("/").get(getUser).post(createUser);
router.route("/:id").patch(updateUser).delete(deleteUser);

export default router;
