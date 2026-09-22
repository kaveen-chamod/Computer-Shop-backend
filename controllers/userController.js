import User from "../Models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 1. Create User
export async function createUser(req, res) {
    try {
        const existing = await User.findOne({ email: req.body.email });
        if (existing != null) {
            return res.json({ message: "User already exists" });
        }
        const passwordHash = await bcrypt.hashSync(req.body.password, 10);
        const newUser = new User({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: passwordHash
        });
        await newUser.save();
        res.json({ message: "User created successfully" });
    } catch (err) {
        res.json({
            message: "Error creating user",
            error: err.message
        });
    }
}

// 2. Login User
export async function loginUser(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (email == null || password == null) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email: email });

        if (user == null) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compareSync(password, user.password);
        if (isPasswordValid) {
            const token = jwt.sign(
                {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isAdmin: user.isAdmin,
                    user: user
                },
                process.env.JWT_KEY || process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );

            res.json({
                message: "Login successful",
                token: token,
                isAdmin: user.isAdmin,
                user: user
            });
        } else {
            res.status(401).json({ message: "Invalid password" });
        }
    } catch (err) {
        res.json({
            message: "Error logging in",
            error: err.message
        });
    }
}

export function isAdmin(req) {
    if (req.user == null) {
        return false;
    }
    return req.user.isAdmin;
}

// 3. Change Password
export async function changePassword(req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY || process.env.JWT_SECRET);
        const userEmail = decoded.email;

        const { currentPassword, newPassword } = req.body;

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error changing password", error: error.message });
    }
}

// 4. Update Profile Picture
export async function updateProfilePicture(req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY || process.env.JWT_SECRET);
        const userEmail = decoded.email;

        let imageUrl = req.body.image;

        if (req.file) {
            const file = req.file;
            const fileName = `profiles/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
            
            const { data, error } = await supabase.storage
                .from("avatars")
                .upload(fileName, file.buffer, { contentType: file.mimetype });

            if (error) throw error;

            const { data: publicUrlData } = supabase.storage
                .from("avatars")
                .getPublicUrl(fileName);
                
            imageUrl = publicUrlData.publicUrl;
        }

        if (!imageUrl) {
            return res.status(400).json({ message: "No image provided" });
        }

        const user = await User.findOneAndUpdate(
            { email: userEmail },
            { image: imageUrl },
            { returnDocument: "after" }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Profile picture updated successfully",
            image: imageUrl,
            user
        });
    } catch (error) {
        console.error("Profile upload error:", error);
        res.status(500).json({ message: "Error updating profile picture", error: error.message });
    }
}

// 5. Admin Management
export async function getUsers(req, res) {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
}

export async function deleteUser(req, res) {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
}

export async function blockUser(req, res) {
    try {
        await User.findByIdAndUpdate(req.params.id, { isBlocked: true });
        res.json({ message: "User blocked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error blocking user" });
    }
}

export async function unblockUser(req, res) {
    try {
        await User.findByIdAndUpdate(req.params.id, { isBlocked: false });
        res.json({ message: "User unblocked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error unblocking user" });
    }
}

export async function toggleAdmin(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isAdmin = !user.isAdmin;
        await user.save();

        res.json({ message: `User role successfully changed to ${user.isAdmin ? 'Admin' : 'Customer'}` });
    } catch (error) {
        res.status(500).json({ message: "Error toggling admin role" });
    }
}

// 6. Forgot Password (OTP නිර්මාණය කර Gmail එකට යැවීම)
export async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User with this email not found" });
        }

        // අංක 6ක OTP කේතයක් සෑදීම
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // OTP එක සහ විනාඩි 10 කල් ඉකුත්වීමේ කාලය DB එකේ Save කිරීම
        user.resetPasswordOtp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; 
        await user.save();

        // Nodemailer Transporter සැකසීම
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // ඊමේල් පණිවිඩය
        const mailOptions = {
            from: `"i-Computers" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Your Password Reset OTP Code",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 500px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #2563eb; text-align: center;">i-Computers</h2>
                    <p>Hello ${user.firstName || "Customer"},</p>
                    <p>You requested a password reset. Use the OTP code below to verify your request:</p>
                    <div style="background: #f8fafc; border: 1px dashed #cbd5e1; padding: 15px; font-size: 26px; font-weight: bold; letter-spacing: 6px; text-align: center; border-radius: 8px; margin: 20px 0; color: #0f172a;">
                        ${otp}
                    </div>
                    <p style="font-size: 12px; color: #64748b;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
                </div>
            `
        };

        // සැබැවින්ම ඊමේල් එක යැවීම
        await transporter.sendMail(mailOptions);
        
        res.json({ message: "OTP sent to your email successfully" });
    } catch (error) {
        console.error("Nodemailer error:", error);
        res.status(500).json({ message: "Error sending OTP email", error: error.message });
    }
}

// 7. Reset Password (OTP පරීක්ෂා කර Password එක වෙනස් කිරීම)
export async function resetPassword(req, res) {
    try {
        const { email, otp, newPassword } = req.body;
        
        const user = await User.findOne({ email });
        if (!user || user.resetPasswordOtp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        
        user.password = hashedNewPassword;
        user.resetPasswordOtp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
}

// 8. Google OAuth Login
const client = new OAuth2Client("596108182923-nhnkrad78ucrtsb37h6dj23mmrlfum22.apps.googleusercontent.com");

export async function googleLogin(req, res) {
    try {
        const { email, firstName, lastName, image } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                firstName: firstName || "User",
                lastName: lastName || "",
                email: email,
                image: image || "",
                isAdmin: false,
                isBlocked: false,
                password: "google_login_authenticated"
            });
            await user.save();
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "Account is blocked. Contact Admin." });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, isAdmin: user.isAdmin },
            process.env.JWT_KEY || process.env.JWT_SECRET || "your_secret_key",
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Google login successful",
            token,
            user
        });
    } catch (error) {
        res.status(500).json({ message: "Google login failed", error: error.message });
    }
}