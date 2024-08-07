import express from "express";
import { param } from "express-validator";
import restaurantFeaturesController from "../controllers/restaurantFeaturesController";

const router = express.Router();

router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City parameter must be a valid string"),
  restaurantFeaturesController.searchRestaurants
);

export default router;
