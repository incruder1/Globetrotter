import express from "express";
import { UserController,findUserController, updateUserScore } from "../controllers/userController.js";
const router = express.Router();

router.post("/", UserController);
router.get("/:userId", findUserController);
router.put("/:userId/score", updateUserScore);

export default router;
