import express from "express";
import { createUser, getUser } from "../controller/user.controller.js";
const router = express.Router();

router.get("/getuser", getUser);
router.post("/createuser", createUser);

export default router;
