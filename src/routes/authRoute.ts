import express from "express";

const router = express.Router();

import authController from "../controllers/authController";

router
  .post("/login", authController.login)
  .post("/signup", authController.signup)
  .post("/logout", authController.logout);

export default router;
