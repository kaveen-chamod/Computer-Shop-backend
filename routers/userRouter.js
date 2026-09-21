import express from "express";
import multer from "multer"; // ⚠️ අලුතින්
import { createUser, loginUser, changePassword, updateProfilePicture } from "../controllers/userController.js";
import { getUsers, deleteUser, blockUser, unblockUser, toggleAdmin ,forgotPassword ,resetPassword } from "../controllers/userController.js";

const userRouter = express.Router();

// Memory Storage භාවිතා කර පින්තූරය ලබාගැනීම
const upload = multer({ storage: multer.memoryStorage() });

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.put("/change-password", changePassword);
userRouter.get("/", getUsers); // සියලුම පරිශීලකයන් ලබා ගැනීමට
userRouter.delete("/:id", deleteUser); // පරිශීලකයෙක් මකා දැමීමට
userRouter.put("/block/:id", blockUser); // Block කිරීමට
userRouter.put("/unblock/:id", unblockUser); // Unblock කිරීමට
userRouter.put("/toggle-admin/:id", toggleAdmin);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

// ⚠️ Multer middleware එක මෙතනට එකතු කර ඇත
userRouter.put("/update-profile-picture", upload.single("profilePicture"), updateProfilePicture);

export default userRouter;



// ... පරණ routes 

