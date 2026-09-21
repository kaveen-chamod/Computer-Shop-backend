import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUsers, FiLogOut } from "react-icons/fi"; // FiLogOut icon එකතු කළා
import { RiProductHuntLine } from "react-icons/ri";
import toast from "react-hot-toast"; // Notification එකක් පෙන්වීමට

import AdminOrders from "./Admin/AdminOrders";
import AdminProduct from "./Admin/AdminProduct";
import AdminUser from "./Admin/AdminUsers";
import AdminAddProductForm from "./Admin/adminAddProductForm";
import AdminEditProductForm from "./Admin/AdminEditProductForm";

export default function AdminPage() {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        try {
            const payloadBase64 = token.split('.')[1];
            const decodedJson = atob(payloadBase64);
            const decodedUser = JSON.parse(decodedJson);

            if (!decodedUser.isAdmin) {
                navigate("/");
            } else {
                setIsAuthorized(true);
            }
        } catch (error) {
            console.error("Token decode error in Admin:", error);
            navigate("/");
        }
    }, [navigate]);

    // Sign out function එක
    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("profilePic");
        toast.success("Admin signed out successfully!");
        navigate("/"); // Home page එකට යවනවා
    };

    if (!isAuthorized) {
        return <div className="w-full h-screen flex justify-center items-center bg-gray-100 font-bold text-xl text-gray-500">Checking Access...</div>;
    }

    return (
        <div className="w-full h-full flex bg-primary min-h-screen">

            {/* SIDEBAR */}
            {/* justify-between යොදාගෙන උඩින් ලින්ක් සහ පහළින් Sign Out බොත්තම තැබීමට සකසා ඇත */}
            <div className="w-75 h-full bg-white flex flex-col justify-between shadow-xl z-10">

                {/* Top Section: Logo & Links */}
                <div>
                    <div className="w-full h-25 py-4 px-2 border-b border-gray-100 flex justify-center items-center">
                        <img src="/logo.png" className="h-full object-contain max-h-[80px]" alt="Isuri Computers" />
                    </div>

                    <div className="flex flex-col mt-4">
                        <Link
                            to="/admin/order"
                            className="w-full p-4 text-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-4 border-b border-gray-50"
                        >
                            <FiShoppingCart className="text-2xl" />
                            <span className="font-medium">Orders</span>
                        </Link>

                        <Link
                            to="/admin/product"
                            className="w-full p-4 text-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-4 border-b border-gray-50"
                        >
                            <RiProductHuntLine className="text-3xl" />
                            <span className="font-medium">Products</span>
                        </Link>

                        <Link
                            to="/admin/users"
                            className="w-full p-4 text-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-4 border-b border-gray-50"
                        >
                            <FiUsers className="text-2xl" />
                            <span className="font-medium">Users</span>
                        </Link>
                    </div>
                </div>

                {/* Bottom Section: Sign Out Button */}
                <div className="p-4 border-t border-gray-100 mt-auto mb-4">
                    <button
                        onClick={handleSignOut}
                        className="w-full p-3 text-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-4 rounded-xl font-bold"
                    >
                        <FiLogOut className="text-2xl" />
                        <span>Sign Out</span>
                    </button>
                </div>

            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 h-full bg-gray-50 p-6 overflow-y-auto">
                <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[calc(100vh-3rem)]">
                    <Routes>
                        <Route path="/" element={<AdminOrders />} />
                        <Route path="/order" element={<AdminOrders />} />
                        <Route path="/product" element={<AdminProduct />} />
                        <Route path="/users" element={<AdminUser />} />
                        <Route path="/add-product" element={<AdminAddProductForm />} />
                        <Route path="/update-product" element={<AdminEditProductForm />} />
                    </Routes>
                </div>
            </div>

        </div>
    );
}