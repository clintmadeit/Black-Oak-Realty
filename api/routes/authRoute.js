import express from "express";
import {
  signup,
  confirmEmail,
  signin,
  google,
  signOut,
  forgotPassword,
  resetPassword,
} from "../contollers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.get("/confirm-email/:token", confirmEmail);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signOut);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id/:token", resetPassword);
//router.get("/reset-password/:id/:token", resetPassword);

export default router;
