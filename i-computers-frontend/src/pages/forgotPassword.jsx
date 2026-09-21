import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiKey, FiArrowLeft } from "react-icons/fi";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1); // Step 1: Email යැවීම, Step 2: OTP & New Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    // 1. Email එකට OTP එකක් ඉල්ලීම
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        setLoading(true);
        try {
            await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/forgot-password", { email });
            toast.success("OTP code sent to your email!");
            setStep(2); // ඊළඟ පියවරට යාම
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // 2. OTP එක සහ අලුත් Password එක සත්‍යාපනය කර වෙනස් කිරීම
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!otp || !newPassword || !confirmPassword) {
            toast.error("All fields are required");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/reset-password", {
                email,
                otp,
                newPassword
            });
            toast.success("Password reset successfully! Please login.");
            navigate("/signin"); // සාර්ථක වූ පසු Login පිටුවට යැවීම
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                
                {/* Back to Login Link */}
                <button 
                    onClick={() => navigate("/signin")}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors mb-6"
                >
                    <FiArrowLeft /> Back to Login
                </button>

                {step === 1 ? (
                    // --- STEP 1: EMAIL INPUT FORM ---
                    <div>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Forgot Password?</h2>
                            <p className="text-sm text-gray-500">Enter your registered email and we'll send you an OTP code to reset your password.</p>
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
                                className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-md disabled:bg-gray-400 mt-2"
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
                            <p className="text-sm text-gray-500">Enter the OTP sent to <span className="font-semibold text-slate-700">{email}</span> and your new password.</p>
                        </div>

                        <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-600">OTP Code</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-gray-400">
                                        <FiKey />
                                    </span>
                                    <input 
                                        type="text" 
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter 6-digit OTP"
                                        required
                                        className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm tracking-widest font-bold"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-600">New Password</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-gray-400">
                                        <FiLock />
                                    </span>
                                    <input 
                                        type="password" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        required
                                        className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-600">Confirm New Password</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-gray-400">
                                        <FiLock />
                                    </span>
                                    <input 
                                        type="password" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        required
                                        className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-md disabled:bg-gray-400 mt-2"
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