import express from "express";
import { getCartItems, loginUser, registerUser, setCartItems } from "../controllers/userController.js";
const router = express.Router();

// This are the user routers with only login and register
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/cartitems/:id",getCartItems);
router.post("/cartitems/:id",setCartItems);

export default router;
