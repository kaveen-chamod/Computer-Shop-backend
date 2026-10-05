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

const JWT_SECRET = () => process.env.JWT_KEY || process.env.JWT_SECRET;

const GOOGLE_CLIENT_ID =
    process.env.GOOGLE_CLIENT_ID ||
    "596108182923-nhnkrad78ucrtsb37h6dj23mmrlfum22.apps.googleusercontent.com";

// Password hash eka response / token walata yanna epa
function safeUser(user) {
    const obj = user.toObject ? user.toObject() : { ...user };
    delete obj.password;
    delete obj.resetPasswordOtp;
    delete obj.otpExpires;
    return obj;
}

// 1. Create User
export async function createUser(req, res) {
    try {
        const existing = await User.findOne({ email: req.body.email });
        if (existing != null) {
            return res.json({ message: "User already exists" });
        }
        const passwordHash = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: passwordHash,
        });
        await newUser.save();
        res.json({ message: "User created successfully" });
    } catch (err) {
        res.json({
            message: "Error creating user",
            error: err.message,
        });
    }
}

// 2. Login User
export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (email == null || password == null) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (user == null) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "Account is blocked. Contact Admin." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin,
                image: user.image,
            },
            JWT_SECRET(),
            { expiresIn: "24h" }
        );

        res.json({
            message: "Login successful",
            token,
            isAdmin: user.isAdmin,
            user: safeUser(user),
        });
    } catch (err) {
        res.status(500).json({
            message: "Error logging in",
            error: err.message,
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
        const decoded = jwt.verify(token, JWT_SECRET());
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

        user.password = await bcrypt.hash(newPassword, 10);
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
        const decoded = jwt.verify(token, JWT_SECRET());
        const userEmail = decoded.email;

        let imageUrl = req.body.image;

        if (req.file) {
            const file = req.file;
            const fileName = `profiles/${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;

            const { error } = await supabase.storage
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
            user: safeUser(user),
        });
    } catch (error) {
        console.error("Profile upload error:", error);
        res.status(500).json({ message: "Error updating profile picture", error: error.message });
    }
}

// 5. Admin Management
export async function getUsers(req, res) {
    try {
        const users = await User.find().select("-password -resetPasswordOtp -otpExpires");
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

        res.json({
            message: `User role successfully changed to ${user.isAdmin ? "Admin" : "Customer"}`,
        });
    } catch (error) {
        res.status(500).json({ message: "Error toggling admin role" });
    }
}

// 6. Forgot Password (send OTP by email)
export async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User with this email not found" });
        }

        const otp = crypto.randomInt(100000, 1000000).toString();

        user.resetPasswordOtp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

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
            `,
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "OTP sent to your email successfully" });
    } catch (error) {
        console.error("Nodemailer error:", error);
        res.status(500).json({ message: "Error sending OTP email", error: error.message });
    }
}

// 7. Reset Password
export async function resetPassword(req, res) {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user || user.resetPasswordOtp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordOtp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
}

// 8. Google OAuth Login (token eka Google ekenma verify karanawa)
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

async function getGoogleProfile({ credential, accessToken }) {
    // A) GoogleLogin component eken enawa ID token (credential)
    if (credential) {
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        });
        const p = ticket.getPayload();
        return {
            email: p.email,
            emailVerified: p.email_verified,
            firstName: p.given_name,
            lastName: p.family_name,
            image: p.picture,
        };
    }

    // B) useGoogleLogin hook eken enawa access token
    if (accessToken) {
        const infoRes = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`
        );
        if (!infoRes.ok) throw new Error("Invalid Google access token");
        const info = await infoRes.json();
        if (info.aud !== GOOGLE_CLIENT_ID) throw new Error("Google token audience mismatch");

        const profRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!profRes.ok) throw new Error("Failed to fetch Google profile");
        const p = await profRes.json();
        return {
            email: p.email,
            emailVerified: p.email_verified,
            firstName: p.given_name,
            lastName: p.family_name,
            image: p.picture,
        };
    }

    throw new Error("Google token is required");
}

export async function googleLogin(req, res) {
    try {
        const profile = await getGoogleProfile(req.body);

        if (!profile.email || profile.emailVerified === false) {
            return res.status(401).json({ message: "Google email not verified" });
        }

        let user = await User.findOne({ email: profile.email });

        if (!user) {
            // Random password (normal login eken use karanna bari wenna)
            const randomPassword = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);
            user = new User({
                firstName: profile.firstName || "User",
                lastName: profile.lastName || "",
                email: profile.email,
                image: profile.image || "",
                isAdmin: false,
                isBlocked: false,
                password: randomPassword,
            });
            await user.save();
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "Account is blocked. Contact Admin." });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin,
                image: user.image,
            },
            JWT_SECRET(),
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Google login successful",
            token,
            isAdmin: user.isAdmin,
            user: safeUser(user),
        });
    } catch (error) {
        console.error("Google login error:", error.message);
        res.status(401).json({ message: "Google login failed", error: error.message });
    }
}