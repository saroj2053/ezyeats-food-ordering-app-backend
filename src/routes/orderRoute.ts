import express from "express";
import protectedRoute from "../middlewares/protectedRoute";
import OrderController from "../controllers/OrderController";

const router = express.Router();

router.post(
  "/checkout/create-checkout-session",
  protectedRoute,
  OrderController.createCheckoutSession
);

export default router;
