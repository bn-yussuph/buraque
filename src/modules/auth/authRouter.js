/**
 * Import required modules
 */
import express from "express"; // Express.js framework
import authController from "./authController.js"; // Authentication controller

/**
 * Create a new Express router instance for authentication routes
 */
const authRouter = express.Router();

/**
 * Define authentication routes
 */
authRouter.post("/signup", authController.signUp); // Handle user sign-up
authRouter.post("/login", authController.login); // Handle user login
authRouter.post("/logout", authController.logout); // Handle user logout
authRouter.post("/changePassword", authController.updatePassword); // Handle password update

/**
 * Export the authentication router
 */
export default authRouter;