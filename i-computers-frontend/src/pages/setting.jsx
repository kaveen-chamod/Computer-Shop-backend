import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiCamera, FiLock, FiCheck } from "react-icons/fi";

export default function Settings() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [imageBase64, setImageBase64] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [loadingImage, setLoadingImage] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    
    const navigate = useNavigate();

    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to view settings");
            navigate("/login");
            return;
        }

        const savedPic = localStorage.getItem("profilePic");
        const storedUser = localStorage.getItem("user");
        
        if (savedPic) {
            setPreviewUrl(savedPic);
        } else if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user.image) {
                    setPreviewUrl(user.image);
                }
            } catch (err) {
                console.error("Error parsing user data:", err);
            }
        }
    }, [navigate]);

    // 1. Handle image selection and preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size must be less than 2MB");
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setImageBase64(reader.result);
                setPreviewUrl(reader.result);
            };
        }
    };

    // 2. Handle profile picture update
    const handleUpdateProfilePic = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please login to update your profile picture");
            return;
        }

        if (!imageBase64) {
            toast.error("Please choose a new image first");
            return;
        }

        setLoadingImage(true);
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://10.10.4.54:3000";
            const response = await axios.put(
                backendUrl + "/api/user/update-profile-picture",
                {
                    image: imageBase64
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("Profile picture updated successfully!");
            
            const updatedImage = response.data.image || imageBase64;
            localStorage.setItem("profilePic", updatedImage);

            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const user = JSON.parse(storedUser);
                user.image = updatedImage;
                localStorage.setItem("user", JSON.stringify(user));
            }

        } catch (error) {
            console.error("Error updating profile picture:", error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
            } else if (error.response?.status === 413) {
                toast.error("Image file is too large for the server!");
            } else {
                toast.error(error.response?.data?.message || "Failed to update profile picture");
            }
        } finally {
            setLoadingImage(false);
        }
    };

    // 3. Handle password change
    const handlePasswordChange = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("All password fields are required");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setLoadingPassword(true);
        try {
            const token = localStorage.getItem("token");
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://10.10.4.54:3000";
            await axios.put(
                backendUrl + "/api/user/change-password",
                {
                    currentPassword,
                    newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            toast.success("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <div className="w-full min-h-[calc(100vh-100px)] bg-gray-50 flex justify-center items-start p-4 md:p-10">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* 1. Profile Picture Section */}
                <div className="flex flex-col items-center border-b lg:border-b-0 lg:border-r border-gray-100 pb-10 lg:pb-0 lg:pr-10">
                    <h2 className="text-2xl font-bold text-slate-800 mb-8 self-start">Profile Picture</h2>
                    
                    <div className="relative group cursor-pointer mb-6">
                        {previewUrl ? (
                            <img 
                                src={previewUrl} 
                                alt="Profile Preview" 
                                className="w-40 h-40 rounded-full object-cover border-4 border-blue-50 shadow-md transition-transform duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-40 h-40 rounded-full bg-slate-100 border-4 border-blue-50 shadow-md flex items-center justify-center text-slate-400 font-bold text-4xl">
                                ?
                            </div>
                        )}

                        <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white font-semibold rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <FiCamera className="text-2xl mb-1" />
                            <span className="text-xs">Change Photo</span>
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>

                    <p className="text-sm text-slate-500 mb-6 text-center">
                        Allowed formats: JPG, PNG, JPEG. Max size 2MB.
                    </p>

                    <button 
                        type="button"
                        onClick={handleUpdateProfilePic}
                        disabled={loadingImage}
                        className="w-full max-w-[250px] bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors disabled:bg-gray-400 cursor-pointer flex items-center justify-center gap-2"
                    >
                        <FiCheck />
                        <span>{loadingImage ? "Uploading..." : "Save Picture"}</span>
                    </button>
                </div>

                {/* 2. Change Password Section */}
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold text-slate-800 mb-8">Security & Password</h2>
                    
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600">Current Password</label>
                            <input 
                                type="password" 
                                value={currentPassword} 
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600">New Password</label>
                            <input 
                                type="password" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600">Confirm New Password</label>
                            <input 
                                type="password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                            />
                        </div>

                        <button 
                            type="button"
                            onClick={handlePasswordChange}
                            disabled={loadingPassword}
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors mt-4 shadow-md shadow-blue-200 disabled:bg-gray-400 disabled:shadow-none cursor-pointer flex items-center justify-center gap-2"
                        >
                            <FiLock />
                            <span>{loadingPassword ? "Updating..." : "Change Password"}</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}