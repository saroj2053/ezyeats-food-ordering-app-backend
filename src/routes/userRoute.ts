import express from "express";
import userController from "../controllers/userController";
import protectedRoute from "../middlewares/protectedRoute";
import { validateMyUserRequest } from "../middlewares/validation";

const router = express.Router();

router
  .get("/profile", protectedRoute, userController.getUserProfile)
  .put(
    "/profile/update",
    protectedRoute,
    validateMyUserRequest,
    userController.updateUserProfile
  );

export default router;
