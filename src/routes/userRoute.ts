import express from "express";
import userController from "../controllers/userController";
import protectedRoute from "../middlewares/protectedRoute";

const router = express.Router();

router
  .get("/profile", protectedRoute, userController.getUserProfile)
  .post("/profile/update", protectedRoute, userController.updateUserProfile);

export default router;
