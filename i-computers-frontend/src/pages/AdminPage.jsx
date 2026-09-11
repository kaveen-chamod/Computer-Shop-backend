import { Routes, Route, Link } from "react-router-dom";
import { FiShoppingCart, FiUsers } from "react-icons/fi";
import { RiProductHuntLine } from "react-icons/ri";

import AdminOrders from "./Admin/AdminOrders";
import AdminProduct from "./Admin/AdminProduct";
import AdminUser from "./Admin/AdminUsers";
import AdminAddProductForm from "./Admin/adminAddProductForm";

export default function AdminPage() {
    return (
        <div className="w-full h-full flex bg-primary">

            {/* SIDEBAR */}
            <div className="w-75 h-full bg-white">

                <div className="w-full h-25 py-4 px-2">
                    <img src="/logo.png" className="h-full" />
                </div>

                <Link
                    to="/admin/order"
                    className="w-full p-4 text-xl text-gray-500 flex items-center gap-4"
                >
                    <FiShoppingCart className="text-2xl" />
                    <span>Orders</span>
                </Link>

                <Link
                    to="/admin/product"
                    className="w-full p-3 text-xl text-gray-500 flex items-center gap-4"
                >
                    <RiProductHuntLine className="text-4xl" />
                    <span>Product</span>
                </Link>

                <Link
                    to="/admin/users"
                    className="w-full p-4 text-xl text-gray-500 flex items-center gap-4"
                >
                    <FiUsers className="text-2xl" />
                    <span>Users</span>
                </Link>

            </div>


            {/* MAIN CONTENT */}
            <div className="flex-1 h-full">

                <Routes>
                    <Route path="/" element={<AdminOrders />} />
                    <Route path="/order" element={<AdminOrders />} />
                    <Route path="/product" element={<AdminProduct />} />
                    <Route path="/users" element={<AdminUser />} />
                    <Route path="/add-product" element={<AdminAddProductForm />} />
                </Routes>

            </div>


            {/* ADD BUTTON */}
            

        </div>
    );
}