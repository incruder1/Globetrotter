import express from "express";
import { UserController,findUserController, updateUserScore, startNewGame } from "../controllers/userController.js";
const router = express.Router();

router.post("/", UserController);
router.get("/:userId", findUserController);
router.put("/:userId/score", updateUserScore);
router.put("/:userId/new-game", startNewGame);

export default router;
