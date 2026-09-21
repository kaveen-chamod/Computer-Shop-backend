import User from "../Models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { createClient } from "@supabase/supabase-js";
import dotenv, { config } from "dotenv"
import crypto from "crypto";

dotenv.config()


const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);



export async function createUser(req, res) {
    try {
        const existing = await User.findOne({ email: req.body.email })
        if (existing != null) {
            res.json({
                message: "User already exists"
            })
            return
        }
        const passwordHash = await bcrypt.hashSync(req.body.password,10)
        const newUser = new User({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: passwordHash
        })
        await newUser.save()
        res.json({
            message: "User created successfully"
        })
    } catch (err) {
        res.json({
            message: "Error creating user",
            error: err.message
        })
    }
}


export async function loginUser(req, res) {
    try {
    const email = req.body.email
    const password = req.body.password

    if(email == null || password == null){
        res.status(400).json({
            message: "Email and password are required"
        })
        return  
    }
    const user = await User.findOne({ email: email })

    if (user == null){
        res.status(404).json({
            message: "User not found"
        })
        return
    }
    const isPasswordValid = await bcrypt.compareSync(password, user.password)
    if (isPasswordValid) {
        const token = jwt.sign(
            {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin,
                user: user

            },
            process.env.JWT_KEY,
            {
             expiresIn : "24h"   
            }
        )

        res.json({
            message: "Login successful",token: token , isAdmin: user.isAdmin
        })
    } else {
        res.status(401).json({
            message: "Invalid password"
        })
    }}
    catch (err) {
        res.json({
            message: "Error logging in",
            error: err.message
        })
    }
}


export function isAdmin(req) {
    if (req.user == null) {
        return false;
    }
    return req.user.isAdmin;
}

export async function changePassword(req, res) {
    try {
        // Frontend එකෙන් එවන Header එකෙන් Token එක අරගන්නවා
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        
        // Token එක Decode කරලා User ගේ Email එක ගන්නවා
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const userEmail = decoded.email;

        const { currentPassword, newPassword } = req.body;

        // User ව Database එකෙන් හොයනවා
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // පරණ Password එක හරිද කියලා බලනවා
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        // අලුත් Password එක Hash කරනවා
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        
        // Database එකේ Save කරනවා
        user.password = hashedNewPassword;
        await user.save();

        res.json({ message: "Password updated successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error changing password", error: error.message });
    }
}


export async function updateProfilePicture(req, res) {
    try {
        // 1. Token එක පරීක්ෂා කිරීම
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const userEmail = decoded.email;

        // 2. ෆයිල් එක (Image) ඇවිත්දැයි බැලීම
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        // 3. Supabase වෙත Upload කිරීම
        // අද්විතීය නමක් සෑදීම (Date.now යොදාගෙන)
        const fileName = `profiles/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
        
        const { data, error } = await supabase.storage
            .from("avatars") // ⚠️ ඔයාගේ Supabase Bucket එකේ නම මෙතන දෙන්න
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
            });

        if (error) {
            throw error;
        }

        // 4. Upload කළ පින්තූරයේ Public URL එක ලබාගැනීම
        const { data: publicUrlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(fileName);
            
        const imageUrl = publicUrlData.publicUrl;

        // 5. MongoDB හි User ගේ දත්ත යාවත්කාලීන කිරීම (image ෆීල්ඩ් එකට URL එක දැමීම)
        const user = await User.findOneAndUpdate(
            { email: userEmail },
            { image: imageUrl }, 
            // 'new: true' වෙනුවට 'returnDocument: "after"' යොදන්න
            { returnDocument: "after" } 
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ 
            message: "Profile picture updated successfully", 
            imageUrl: imageUrl 
        });

    } catch (error) {
        console.error("Profile upload error:", error);
        res.status(500).json({ message: "Error updating profile picture", error: error.message });
    }
}




// සියලුම පරිශීලකයන් ලබා ගැනීම
export async function getUsers(req, res) {
    try {
        const users = await User.find().select("-password"); // Password එක හැර අනිත් දත්ත යවයි
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
}

// පරිශීලකයෙකු මකා දැමීම
export async function deleteUser(req, res) {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
}

// පරිශීලකයෙකු Block කිරීම
export async function blockUser(req, res) {
    try {
        await User.findByIdAndUpdate(req.params.id, { isBlocked: true });
        res.json({ message: "User blocked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error blocking user" });
    }
}

// පරිශීලකයෙකු Unblock කිරීම
export async function unblockUser(req, res) {
    try {
        await User.findByIdAndUpdate(req.params.id, { isBlocked: false });
        res.json({ message: "User unblocked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error unblocking user" });
    }
}

// පරිශීලකයෙකු Admin කිරීම හෝ Admin අයිතිය ඉවත් කිරීම
export async function toggleAdmin(req, res) {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // දැනට තියෙන තත්ත්වය (isAdmin) අනෙක් පැත්තට හැරවීම (true නම් false, false නම් true)
        user.isAdmin = !user.isAdmin;
        await user.save();

        res.json({ message: `User role successfully changed to ${user.isAdmin ? 'Admin' : 'Customer'}` });
    } catch (error) {
        res.status(500).json({ message: "Error toggling admin role" });
    }
}


export async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User with this email not found" });
        }

        // අංක 6ක අහඹු OTP එකක් සෑදීම
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // OTP එක සහ එහි කල් ඉකුත් වීමේ කාලය (උදා: විනාඩි 10ක්) Database එකේ Save කිරීම
        user.resetPasswordOtp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; 
        await user.save();

        // TODO: මෙතැනදී Nodemailer භාවිතයෙන් user.email වෙත 'otp' එක ඊමේල් කරන්න.
        
        res.json({ message: "OTP sent to your email successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error sending OTP", error: error.message });
    }
}

// 2. Reset Password (OTP පරීක්ෂා කර අලුත් මුරපදය දැමීම)
export async function resetPassword(req, res) {
    try {
        const { email, otp, newPassword } = req.body;
        
        const user = await User.findOne({ email });
        if (!user || user.resetPasswordOtp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // අලුත් Password එක Hash කිරීම
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        
        user.password = hashedNewPassword;
        user.resetPasswordOtp = undefined; // OTP එක ඉවත් කිරීම
        user.otpExpires = undefined;
        await user.save();

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
}