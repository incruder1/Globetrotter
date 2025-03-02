import express from "express";
import { destinationsController } from "../controllers/destinationControllers.js";
const router = express.Router();

router.get("/random/", destinationsController);

export default router;
