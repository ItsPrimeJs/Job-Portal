import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// User registration route
router.post("/register", registerUser);

// User login route
router.post("/login", loginUser);

// User logout route
router.post("/logout", logoutUser);

// User profile update route (protected route)
router.patch("/profile/update", isAuthenticated, updateProfile);

export default router;