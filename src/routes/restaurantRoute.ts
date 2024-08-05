import express from "express";

import multer from "multer";
import protectedRoute from "../middlewares/protectedRoute";
import restaurantController from "../controllers/restaurantController";
import { validateRestaurantRequest } from "../middlewares/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.post(
  "/",
  upload.single("imageFile"),
  validateRestaurantRequest,
  protectedRoute,
  restaurantController.createRestaurant
);

export default router;
