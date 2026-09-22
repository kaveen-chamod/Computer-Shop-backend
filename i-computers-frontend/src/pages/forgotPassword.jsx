import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiKey, FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP & New Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    
    const navigate = useNavigate();

    // 1. Email request to send OTP
    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        if (!email.trim()) {
            toast.error("Please enter your email address");
            return;
        }

        setLoading(true);
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
            await axios.post(backendUrl + "/api/user/forgot-password", { email: email.trim() });
            toast.success("OTP code sent to your email!");
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // send OTP again if user requests
    const handleResendOtp = async () => {
        setResending(true);
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
            await axios.post(backendUrl + "/api/user/forgot-password", { email: email.trim() });
            toast.success("New OTP code sent!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resend OTP");
        } finally {
            setResending(false);
        }
    };

    // 2. Handle password reset with OTP
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!otp.trim() || !newPassword || !confirmPassword) {
            toast.error("All fields are required");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
            await axios.post(backendUrl + "/api/user/reset-password", {
                email: email.trim(),
                otp: otp.trim(),
                newPassword
            });
            toast.success("Password reset successfully! Please login.");
            navigate("/signin");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                
                {/* Back Link */}
                <button 
                    type="button"
                    onClick={() => step === 2 ? setStep(1) : navigate("/signin")}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-slate-800 transition-colors mb-6 cursor-pointer"
                >
                    <FiArrowLeft /> {step === 2 ? "Change Email" : "Back to Login"}
                </button>

                {step === 1 ? (
                    // --- STEP 1: EMAIL INPUT FORM ---
                    <div>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Forgot Password?</h2>
                            <p className="text-sm text-gray-500">
                                Enter your registered email and we'll send you an OTP code to reset your password.
                            </p>
                        </div>

                        <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-600">Email Address</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-gray-400">
                                        <FiMail />
                                    </span>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 disabled:bg-gray-400 disabled:shadow-none mt-2 cursor-pointer"
                            >
                                {loading ? "Sending OTP..." : "Send OTP Code"}
                            </button>
                        </form>
                    </div>
                ) : (
                    // --- STEP 2: OTP & NEW PASSWORD FORM ---
                    <div>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Reset Password</h2>
                            <p className="text-sm text-gray-500">
                                Enter the 6-digit OTP sent to <br />
                                <span className="font-semibold text-slate-700">{email}</span>
                            </p>
                        </div>

                        <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
                            {/* OTP Field */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-slate-600">OTP Code</label>
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={resending}
                                        className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer disabled:text-gray-400"
                                    >
                                        {resending ? "Sending..." : "Resend OTP"}
                                    </button>
                                </div>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-gray-400">
                                        <FiKey />
                                    </span>
                                    <input 
                                        type="text" 
                                        maxLength="6"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="6-digit OTP"
                                        required
                                        className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm tracking-widest font-bold text-center"
                                    />
                                </div>
                            </div>

                            {/* New Password Field */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-600">New Password</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-gray-400">
                                        <FiLock />
                                    </span>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Minimum 6 characters"
                                        required
                                        className="w-full h-12 pl-11 pr-11 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-600">Confirm New Password</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-gray-400">
                                        <FiLock />
                                    </span>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter new password"
                                        required
                                        className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 disabled:bg-gray-400 disabled:shadow-none mt-2 cursor-pointer"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
}