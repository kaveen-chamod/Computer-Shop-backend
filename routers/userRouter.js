import express from "express";
import multer from "multer"; // ⚠️ අලුතින්
import { createUser, loginUser, changePassword, updateProfilePicture } from "../controllers/userController.js";
import { getUsers, deleteUser, blockUser, unblockUser, toggleAdmin ,forgotPassword ,resetPassword } from "../controllers/userController.js";
import { googleLogin } from "../controllers/userController.js";

const userRouter = express.Router();

// add multer middleware for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.put("/change-password", changePassword);
userRouter.get("/", getUsers); // get all users
userRouter.delete("/:id", deleteUser); 
userRouter.put("/block/:id", blockUser); 
userRouter.put("/unblock/:id", unblockUser); 
userRouter.put("/toggle-admin/:id", toggleAdmin);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/google-login", googleLogin);

// add route for updating profile picture
userRouter.put("/update-profile-picture", upload.single("profilePicture"), updateProfilePicture);

export default userRouter;


