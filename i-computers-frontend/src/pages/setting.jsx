import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Settings() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("/profile-picture.png");
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    // පිටුවට පිවිසෙන විට User ලොග් වී ඇත්දැයි පරීක්ෂා කිරීම
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to view settings");
            navigate("/login");
        }
    }, [navigate]);

    // පින්තූරය තේරූ විට Preview එක පෙන්වීම
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Profile Picture එක Backend එකට යැවීම
    const handleUpdateProfilePic = async () => {
        if (!imageFile) {
            toast.error("Please select an image first");
            return;
        }
        
        setLoading(true);
        const formData = new FormData();
        formData.append("profilePicture", imageFile);

        try {
            const token = localStorage.getItem("token");
            // ⚠️ මෙතන 'const response = ' කියලා එකතු කරගන්න
            const response = await axios.put(import.meta.env.VITE_BACKEND_URL + "/api/user/update-profile-picture", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });
            
            toast.success("Profile picture updated successfully!");
            
            // ⚠️ අලුතින් එකතු කළ කොටස: අලුත් පින්තූරය Save කර Page එක Reload කිරීම
            localStorage.setItem("profilePic", response.data.imageUrl);
            window.location.reload();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile picture");
        } finally {
            setLoading(false);
        }
    };

    // Password එක වෙනස් කිරීම
    const handlePasswordChange = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("All password fields are required");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.put(import.meta.env.VITE_BACKEND_URL + "/api/user/change-password", {
                currentPassword,
                newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            toast.success("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-[calc(100vh-100px)] bg-gray-50 flex justify-center items-start p-4 md:p-10">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* 1. Profile Picture Update Section */}
                <div className="flex flex-col items-center border-b lg:border-b-0 lg:border-r border-gray-100 pb-10 lg:pb-0 lg:pr-10">
                    <h2 className="text-2xl font-bold text-slate-800 mb-8 self-start">Profile Picture</h2>
                    
                    <div className="relative group cursor-pointer mb-6">
                        <img 
                            src={previewUrl} 
                            alt="Profile Preview" 
                            className="w-40 h-40 rounded-full object-cover border-4 border-blue-50 shadow-md transition-transform duration-300 group-hover:scale-105"
                        />
                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-semibold rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            Choose Image
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
                        onClick={handleUpdateProfilePic}
                        disabled={loading}
                        className="w-full max-w-[250px] bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors disabled:bg-gray-400"
                    >
                        {loading ? "Uploading..." : "Update Picture"}
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
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600">New Password</label>
                            <input 
                                type="password" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600">Confirm New Password</label>
                            <input 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            />
                        </div>

                        <button 
                            onClick={handlePasswordChange}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors mt-4 shadow-md shadow-blue-200 disabled:bg-gray-400 disabled:shadow-none"
                        >
                            {loading ? "Updating..." : "Change Password"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}